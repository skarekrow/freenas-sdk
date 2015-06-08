// CHART HANDLER
// =============
// Mixin used to take the trouble of chart handling from individual widgets
// Remains of StatdWidgetContentHandler

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _reactComponentWidthMixin = require("react-component-width-mixin");

var _reactComponentWidthMixin2 = _interopRequireDefault(_reactComponentWidthMixin);

var _middlewareStatdMiddleware = require("../../../middleware/StatdMiddleware");

var _middlewareStatdMiddleware2 = _interopRequireDefault(_middlewareStatdMiddleware);

var _storesStatdStore = require("../../../stores/StatdStore");

var _storesStatdStore2 = _interopRequireDefault(_storesStatdStore);

var _Widget = require("../../Widget");

var _Widget2 = _interopRequireDefault(_Widget);

var i = 0;

module.exports = {
  mixins: [_reactComponentWidthMixin2["default"]],

  getInitialState: function getInitialState() {
    var initialStatdData = {};

    return {
      chart: "",
      stagedUpdate: {},
      graphType: "line",
      legendStateObj: {},
      legendStateArr: [],
      errorMode: false,
      statdData: initialStatdData,
      statdDataLoaded: false,
      svgStyle: {
        width: "calc(100% - 36px)",
        height: this.props.dimensions[1] - 16,
        "float": "left"
      },
      divStyle: {
        width: "36px",
        height: "100%",
        "float": "right"
      }
    };
  },

  componentDidMount: function componentDidMount() {
    _storesStatdStore2["default"].addChangeListener(this.handleStatdChange);
    var newState = {};
    if (this.state.statdResources.length > 0) {
      this.requestData();
      this.subscribeToUpdates();
    }

    if (this.state.chartTypes.length > 0) {
      newState.graphType = _lodash2["default"].result(_lodash2["default"].findWhere(this.state.chartTypes, { "primary": true }), "type");
    }

    this.setState(newState);
  },

  subscribeToUpdates: function subscribeToUpdates() {
    _middlewareStatdMiddleware2["default"].subscribeToPulse(this.state.widgetIdentifier, this.state.statdResources.map(this.createStatdSources));
  },

  requestData: function requestData() {
    var stop = (0, _moment2["default"])();
    var start = (0, _moment2["default"])().subtract(15, "m");

    _lodash2["default"].forEach(this.state.statdResources, function (resource) {
      _middlewareStatdMiddleware2["default"].requestWidgetData(resource.dataSource, start.format(), stop.format(), "10S");
    });
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var newState = {};
    if (this.state.statdResources.length !== prevState.statdResources.length) {
      this.requestData();
      this.subscribeToUpdates();
    }

    if (this.state.chartTypes.length !== prevState.chartTypes.length) {
      newState.graphType = _lodash2["default"].result(_lodash2["default"].findWhere(this.state.chartTypes, { "primary": true }), "type");
    }

    this.setState(newState);

    // Only update if we have the required props, there is no staged update
    // currently being assembled, and we have access to both D3 and NVD3
    // (on the basis that the component is mounted)
    if (this.isMounted() && this.state.chartTypes.length > 0 && this.state.statdDataLoaded) {
      if (!this.state.chart) {
        this.drawChart();
      }
      var chartShouldReload = prevState.graphType !== this.state.graphType;
      //var statdDataExists = _.all( this.state.statdData, function( dataArray ) {
      //  return _.isArray( dataArray ) && dataArray.length > 0;
      //});

      if (chartShouldReload) {
        this.drawChart(chartShouldReload);
      } else if (_lodash2["default"].isEmpty(this.state.stagedUpdate) && !_lodash2["default"].isEmpty(prevState.stagedUpdate)) {
        this.drawChart();
      }

      if (prevState.componentWidth !== this.state.componentWidth) {
        //console.log("redraw");
        this.drawChart();
      }
    }
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return nextState.statdResources !== this.state.statdResources || nextState.chartTypes !== this.state.chartTypes || nextState.statdDataLoaded !== this.state.statdDataLoaded || nextState.stagedUpdate !== this.state.stagedUpdate || nextState.graphType !== this.state.graphType || nextState.componentWidth !== this.state.componentWidth || nextProps.position !== this.props.position;
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesStatdStore2["default"].removeChangeListener(this.handleStatdChange);
    _middlewareStatdMiddleware2["default"].unsubscribeFromPulse(this.state.widgetIdentifier, this.state.statdResources.map(this.createStatdSources));
  },

  createStatdSources: function createStatdSources(dataObject) {
    return dataObject.dataSource;
  },

  handleStatdChange: function handleStatdChange() {
    var newState = {};

    // Do we have initial stack of data?
    if (this.state.statdDataLoaded === true) {
      var dataUpdate = _storesStatdStore2["default"].getWidgetDataUpdate();
      var updateTarget = _lodash2["default"].find(this.state.statdResources, function (resource) {
        return dataUpdate.name === "statd." + resource.dataSource + ".pulse";
      });

      // Don't bother doing anything unless we have a valid target, based on
      // something in our statdResources. This means the widget won't update based
      // on pulse data intended for other widgets.
      if (updateTarget && updateTarget["variable"]) {
        var updateVariable = updateTarget["variable"];
        var stagedUpdate = _lodash2["default"].cloneDeep(this.state.stagedUpdate);
        var newDataPoint = [dataUpdate.args["timestamp"], dataUpdate.args["value"]];

        // Ideally, each of the n responses will be sent one after another - if
        // they aren't, they should be queued up in stagedUpdate so that they can
        // be updated as a single batch - making sure the chart only re-renders when
        // all n of the specified data is available. This logic could be modified
        // to set a certain threshhold beyond which the chart would force an update
        // even if it was still waiting for one of the pulses, or it had receieved
        // five of one and only one of all the others, etc.

        // TODO: More clear business logic for data display

        if (stagedUpdate[updateVariable] && _lodash2["default"].isArray(stagedUpdate[updateVariable])) {
          stagedUpdate[updateVariable].push(newDataPoint);
        } else {
          stagedUpdate[updateVariable] = [newDataPoint];
        }

        if (_lodash2["default"].keys(stagedUpdate).length >= this.state.statdResources.length) {
          newState.statdData = {};

          _lodash2["default"].forEach(stagedUpdate, (function (data, key) {
            var newData = this.state.statdData[key] ? this.state.statdData[key].concat(data) : [];
            newState.statdData[key] = _lodash2["default"].takeRight(newData, 100);
          }).bind(this));
          stagedUpdate = {};
        }

        this.setState(_lodash2["default"].merge({ "stagedUpdate": stagedUpdate }, newState));
      }
    } else {
      newState.statdData = {};
      _lodash2["default"].forEach(this.state.statdResources, function (resource) {
        newState.statdData[resource.variable] = _storesStatdStore2["default"].getWidgetData(resource.dataSource) || [];

        if (newState.statdData[resource.variable] && newState.statdData[resource.variable].error) {
          newState.errorMode = true;
        }
      });

      newState.statdDataLoaded = _lodash2["default"].all(newState.statdData, function (dataArray) {
        return _lodash2["default"].isArray(dataArray) && dataArray.length > 0;
      });
      this.setState(newState);
    }
  },

  drawChart: function drawChart(chartShouldReload) {
    var newState = {};
    var chartSVGNode = this.refs.svg.getDOMNode();
    var xLabel;
    var yUnit;
    newState.legendStateArr = this.state.legendStateArr;
    newState.legendStateObj = this.state.legendStateObj;

    newState["chart"] = this.state.chart ? this.state.chart : null;

    if (chartShouldReload) {
      // Way how to make sure only the desired tooltips are displayed.
      d3.select(chartSVGNode).on("mousemove", null).on("mouseout", null).on("dblclick", null).on("click", null).selectAll("*").remove();

      newState["chart"] = null;
      newState.legendStateArr = [];
      newState.legendStateObj = {};
    }

    if (newState["chart"]) {
      // There is an existing representation of the chart, which has been
      // carried over from the previous state, and it should just be updated.
      d3.select(chartSVGNode).datum(this.chartData(this.state.graphType)).call(newState["chart"]);

      if (!_lodash2["default"].isEmpty(newState.legendStateObj)) {
        if (this.state.graphType === "pie") {
          newState["chart"].dispatch.changeState({ disabled: newState.legendStateObj });
        } else {
          newState["chart"].dispatch.changeState({ disabled: newState.legendStateArr });
        }
      } else {
        newState["chart"].update();
      }
    } else {
      // Either this is the first run, the chart type has changed, or something
      // else has happened to require a complete reload of the chart.
      var graphTypeObject = _lodash2["default"].findWhere(this.state.chartTypes, { "type": this.state.graphType });
      var newChart;

      switch (this.state.graphType) {

        case "stacked":
          newChart = nv.models.stackedAreaChart().options({
            margin: { top: 15, right: 40, bottom: 60, left: 60 },
            x: graphTypeObject.x || function (d) {
              return d[0];
            } //We can modify the data accessor functions...
            , y: graphTypeObject.y || function (d) {
              return d[1];
            } //...in case your data is formatted differently.
            , transitionDuration: 250,
            style: "Expanded",
            showControls: false //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
            , clipEdge: false,
            useInteractiveGuideline: true //Tooltips which show all data points. Very nice!
          });

          // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly,
          // return themselves, not the parent chart, so need to chain separately
          xLabel = graphTypeObject.xLabel || "Time";
          newChart.xAxis.axisLabel(xLabel).tickFormat(function (d) {
            return _moment2["default"].unix(d).format("HH:mm:ss");
          });

          yUnit = graphTypeObject.yUnit || "";
          newChart.yAxis.axisLabel(graphTypeObject.yLabel).tickFormat(function (d) {
            return d + yUnit;
          });
          break;

        case "line":
          newChart = nv.models.lineChart().options({
            margin: { top: 15, right: 40, bottom: 60, left: 60 },
            x: graphTypeObject.x || function (d) {
              return d[0];
            },
            y: graphTypeObject.y || function (d) {
              return d[1];
            },
            showXAxis: true,
            showYAxis: true,
            transitionDuration: 250,
            forceY: graphTypeObject.forceY //[0, 100]
            , useInteractiveGuideline: true
          });

          // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
          xLabel = graphTypeObject.xLabel || "Time";
          newChart.xAxis.axisLabel(xLabel).tickFormat(function (d) {
            return _moment2["default"].unix(d).format("HH:mm:ss");
          });

          yUnit = graphTypeObject.yUnit || "";
          newChart.yAxis.axisLabel(graphTypeObject.yLabel).tickFormat(function (d) {
            return d + yUnit;
          });
          break;

        case "pie":
          var colors = [];
          _lodash2["default"].forEach(this.state.statdResources, function (resource) {
            colors.push(resource.color);
          });
          newChart = nv.models.pieChart().options({
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            x: graphTypeObject.x || function (d) {
              return d.label;
            },
            y: graphTypeObject.y || function (d) {
              return d.value;
            },
            color: colors,
            showLabels: true,
            labelThreshold: 1,
            labelType: "value" //Configure what type of data to show in the label. Can be "key", "value" or "percent"
            , transitionDuration: 250,
            donut: false,
            donutRatio: 0.35
          });
          break;

        default:
          console.log(this.state.graphType + " is not a supported chart type.");
          return;
      }
      var hndlChrtStChng = this.handleChartStateChange;
      newChart.dispatch.on("stateChange", function (e) {
        hndlChrtStChng(e);
      });
      newState["chart"] = newChart;

      d3.select(chartSVGNode).datum(this.chartData(this.state.graphType)).call(newState["chart"]);

      // TODO: Figure out a good way to do this automatically
      // nv.utils.windowResize(chart.update);
      // nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });

      // chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
    }

    this.setState(newState);
  },

  handleChartStateChange: function handleChartStateChange(newChartState) {
    var legendStateObject = {};
    var legendStateArray = newChartState["disabled"];

    for (var i = 0; i < newChartState["disabled"].length; i++) {
      legendStateObject[i] = newChartState["disabled"][i];
    }

    this.setState({ legendStateObj: legendStateObject,
      legendStateArr: legendStateArray });
    // console.log(legendStateObject);
  },

  chartData: function chartData(chartType) {
    var returnArray = [];
    var statdData = this.state.statdData;

    switch (chartType) {
      case "line":
        _lodash2["default"].forEach(this.state.statdResources, (function (resource) {
          var returnArrayMember = {
            area: resource.area || false,
            values: statdData[resource.variable],
            key: resource.name,
            color: resource.color
          };
          returnArray.push(returnArrayMember);
        }).bind(this));
        break;

      case "stacked":
        _lodash2["default"].forEach(this.state.statdResources, (function (resource) {
          var returnArrayMember = {
            values: statdData[resource.variable],
            key: resource.name,
            color: resource.color
          };
          returnArray.push(returnArrayMember);
        }).bind(this));
        break;

      case "pie":
        _lodash2["default"].forEach(this.state.statdResources, (function (resource) {
          var returnArrayMember = {
            value: statdData[resource.variable][statdData[resource.variable].length - 1][1],
            label: resource.name
          };
          returnArray.push(returnArrayMember);
        }).bind(this));
        break;

    }
    return returnArray;
  },

  returnErrorMsgs: function returnErrorMsgs(resource, index) {
    var errorMsg;
    var statdData = this.state.statdData;

    if (statdData[resource.variable] && statdData[resource.variable].msg) {
      errorMsg = resource.variable + ": " + statdData[resource.variable].msg;
    } else {
      errorMsg = "OK";
    }

    return _react2["default"].createElement(
      "div",
      { key: index },
      errorMsg
    );
  },

  returnGraphOptions: function returnGraphOptions(resource, index) {
    var selectedGraphType = "";
    if (resource.type === this.state.graphType) {
      selectedGraphType = " selected";
    }
    return _react2["default"].createElement(
      "div",
      {
        key: index,
        className: "ico-graph-type-" + resource.type + selectedGraphType,
        onTouchStart: this.toggleGraph,
        onClick: this.toggleGraph },
      resource.type
    );
  },

  toggleGraph: function toggleGraph(event) {
    this.setState({ graphType: event.target.textContent });
  },

  render: function render() {
    if (this.state.errorMode) {
      return _react2["default"].createElement(
        _Widget2["default"],
        {
          dimensions: this.props.dimensions,
          position: this.props.position,
          title: this.props.title,
          size: this.props.size },
        _react2["default"].createElement(
          "div",
          { className: "widget-error-panel" },
          _react2["default"].createElement(
            "h4",
            null,
            "Something went sideways."
          ),
          this.state.statdResources.map(this.returnErrorMsgs, this)
        )
      );
    } else if (this.state.statdDataLoaded && this.state.chartTypes.length > 0) {
      return _react2["default"].createElement(
        _Widget2["default"],
        {
          dimensions: this.props.dimensions,
          position: this.props.position,
          title: this.props.title,
          size: this.props.size },
        _react2["default"].createElement(
          "div",
          { className: "widget-content" },
          _react2["default"].createElement("svg", { ref: "svg", style: this.state.svgStyle }),
          _react2["default"].createElement(
            "div",
            { ref: "controls", style: this.state.divStyle },
            this.state.chartTypes.map(this.returnGraphOptions)
          )
        )
      );
    } else {
      return _react2["default"].createElement(
        _Widget2["default"],
        {
          dimensions: this.props.dimensions,
          position: this.props.position,
          title: this.props.title,
          size: this.props.size },
        _react2["default"].createElement(
          "div",
          { className: "widget-error-panel" },
          _react2["default"].createElement(
            "h4",
            null,
            "Loading..."
          )
        )
      );
    }
  }
};
//# sourceMappingURL=chartHandler.js.map
