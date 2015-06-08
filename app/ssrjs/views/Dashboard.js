// Dashboard
// =========
// Default view for FreeNAS, shows overview of system and other general
// information.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _middlewareServicesMiddleware = require("../middleware/ServicesMiddleware");

var _middlewareServicesMiddleware2 = _interopRequireDefault(_middlewareServicesMiddleware);

var _storesServicesStore = require("../stores/ServicesStore");

var _storesServicesStore2 = _interopRequireDefault(_storesServicesStore);

var _componentsWidgetsMemoryUtil = require("../components/Widgets/MemoryUtil");

var _componentsWidgetsMemoryUtil2 = _interopRequireDefault(_componentsWidgetsMemoryUtil);

var _componentsWidgetsCpuUtil = require("../components/Widgets/CpuUtil");

var _componentsWidgetsCpuUtil2 = _interopRequireDefault(_componentsWidgetsCpuUtil);

var _componentsWidgetsSystemInfo = require("../components/Widgets/SystemInfo");

var _componentsWidgetsSystemInfo2 = _interopRequireDefault(_componentsWidgetsSystemInfo);

var _componentsWidgetsSystemLoad = require("../components/Widgets/SystemLoad");

var _componentsWidgetsSystemLoad2 = _interopRequireDefault(_componentsWidgetsSystemLoad);

var _componentsWidgetsNetworkUsage = require("../components/Widgets/NetworkUsage");

var _componentsWidgetsNetworkUsage2 = _interopRequireDefault(_componentsWidgetsNetworkUsage);

var _componentsWidgetsDiskUsage = require("../components/Widgets/DiskUsage");

var _componentsWidgetsDiskUsage2 = _interopRequireDefault(_componentsWidgetsDiskUsage);

var generateUUID = function generateUUID() {
  var rawUUID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  return rawUUID.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === "x" ? r : r & 3 | 8;

    return v.toString(16);
  });
};

var widgetSizes = { "xs-square": [75, 75],
  "xs-rect": [165, 75],
  "s-square": [165, 165],
  "s-rect": [255, 165],
  "sl-rect": [345, 165],
  "m-square": [255, 255],
  "m-rect": [345, 255],
  "ml-rect": [435, 255],
  "l-square": [345, 345],
  "l-rect": [525, 345],
  "xl-rect": [705, 525]
};

var Dashboard = _react2["default"].createClass({
  displayName: "Dashboard",

  getDefaultProps: function getDefaultProps() {
    return {
      // The size of each grid unit in pixels.
      gridSize: 15
      // The amount of padding in grid units that should be in between any
      // two adjacent widgets.
      , gridGutter: 1
    };
  },

  getInitialState: function getInitialState() {
    return {
      servicesList: _storesServicesStore2["default"].getAllServices(),
      movementMode: false,
      widgets: {
        SystemInfo: {
          id: generateUUID(),
          dimensions: widgetSizes["m-rect"]
        },
        MemoryUtil: {
          id: generateUUID(),
          dimensions: widgetSizes["m-rect"]
        },
        CpuUtil: {
          id: generateUUID(),
          dimensions: widgetSizes["m-rect"]
        },
        SystemLoad: {
          id: generateUUID(),
          dimensions: widgetSizes["m-rect"]
        },
        NetworkUsage: {
          id: generateUUID(),
          dimensions: widgetSizes["l-rect"]
        },
        DiskUsage: {
          id: generateUUID(),
          dimensions: widgetSizes["l-rect"]
        }
      }
    };
  },

  componentDidMount: function componentDidMount() {
    _middlewareServicesMiddleware2["default"].requestServicesList();
    _storesServicesStore2["default"].addChangeListener(this.handleServicesChange);
    window.addEventListener("mouseup", this.exitMovementMode);
    window.addEventListener("resize", this.handleResize);
    this.initializeWidgets();
    this.setState({
      gridWidth: this.calculateGridWidth()
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesServicesStore2["default"].removeChangeListener(this.handleServicesChange);
    window.removeEventListener("mouseup", this.exitMovementMode);
    window.removeEventListener("resize', this.handleResize");
  },

  handleServicesChange: function handleServicesChange() {
    this.setState({
      servicesList: _storesServicesStore2["default"].getAllServices()
    });
  },

  handleResize: function handleResize() {
    this.setState({
      gridWidth: this.calculateGridWidth()
    });
    this.initializeWidgets();
  }

  // Calculate how many grid units will fit in the window.
  , calculateGridWidth: function calculateGridWidth() {
    return this.toGridUnits(this.getDOMNode("thePlayground").offsetWidth);
  }

  // Converts pixels to grid units. Rounds down.
  , toGridUnits: function toGridUnits(pixels) {
    return Math.round(parseInt(pixels) / this.props.gridSize);
  }

  // Converts grid units to pixels.
  , toPixels: function toPixels(gridUnits) {
    return gridUnits * this.props.gridSize;
  }

  // Begin moving a widget around. Records the id of the moving widget
  // and its starting location.

  , enterMovementMode: function enterMovementMode(id, event) {
    console.log(id);
    console.log(event);
    this.setState({
      movementMode: true,
      widgetInMotion: {
        id: id,
        origin: [event.nativeEvent.clientX, event.nativeEvent.clientY]
      }
    });
  },

  calculateMovement: function calculateMovement(event) {
    if (this.state.movementMode) {
      var newPos = [];
      var wim = this.state.widgetInMotion;

      _lodash2["default"].forEach(this.state.widgets, function (widgt) {
        if (widgt.id === wim.id) {
          newPos.push.apply(newPos, widgt.position);
        }
      });

      newPos[1] = this.toPixels(newPos[1] + this.toGridUnits(event.nativeEvent.clientY - wim.origin[1])) + "px";
      newPos[0] = this.toPixels(newPos[0] + this.toGridUnits(event.nativeEvent.clientX - wim.origin[0])) + "px";

      console.log(newPos);
      console.log(this.refs);

      this.moveWidget(this.refs["widget-" + wim.id].getDOMNode(), newPos);
    }
  }

  // When a widget is released from movement, change its location and move any
  // overlapping widgets out of the way.
  , exitMovementMode: function exitMovementMode() {
    var movedWidget = document.querySelector(".widget.in-motion");
    var newState = {};

    if (movedWidget) {
      var newPosition = [this.toGridUnits(movedWidget.style.left), this.toGridUnits(movedWidget.style.top)];
      var displayMatrix = _lodash2["default"].clone(this.state.displayMatrix);
      var widgetMeta = this.state.widgetMeta;
      var intersections;

      // Fill the moved widget's old spot with zeroes
      this.createMatrixFootprint(displayMatrix, widgetMeta[this.state.widgetInMotion["id"]]["pos"], widgetMeta[this.state.widgetInMotion["id"]]["size"], 0);

      intersections = this.findIntersections(displayMatrix, newPosition, widgetMeta[this.state.widgetInMotion["id"]]["size"]);

      // Zero out the positions of the intersecting widgets
      for (var i = 0; i < intersections.length; i++) {
        this.createMatrixFootprint(displayMatrix, widgetMeta[intersections[i]]["pos"], widgetMeta[intersections[i]]["size"], 0);
      }

      // Identify and assign the new widget position
      widgetMeta[this.state.widgetInMotion["id"]]["pos"] = newPosition;
      this.createMatrixFootprint(displayMatrix, newPosition, widgetMeta[this.state.widgetInMotion["id"]]["size"], this.state.widgetInMotion["id"]);

      // Re-home the intersecting widgets
      for (var i = 0; i < intersections.length; i++) {
        var newPos = this.findEmptySpace(displayMatrix, widgetMeta[intersections[i]]["size"]);

        widgetMeta[intersections[i]]["pos"] = newPos;

        this.moveWidget(this.refs["widget-" + intersections[i]].getDOMNode(), [this.toPixels(newPos[0]) + "px", this.toPixels(newPos[1]) + "px"], 350);
        this.createMatrixFootprint(displayMatrix, widgetMeta[intersections[i]]["pos"], widgetMeta[intersections[i]]["size"], intersections[i]);
      }

      newState["displayMatrix"] = displayMatrix;
      newState["widgetMeta"] = widgetMeta;
    }

    newState["movementMode"] = false;
    newState["widgetInMotion"] = null;

    this.setState(newState);
  }

  // Animation for widget movement.
  , moveWidget: function moveWidget(widgetElement, newPos, duration) {
    console.log(widgetElement);
    Velocity(widgetElement, {
      left: newPos[0],
      top: newPos[1]
    }, {
      easing: [0, 0.77, 0.47, 0.99],
      duration: duration ? duration : 50,
      queue: false
    });
  }

  // Add more space to the bottom of the grid. Used when a widget doesn't fit.
  , addEmptyRows: function addEmptyRows(displayMatrix, rows) {
    for (var i = 0; i < rows; i++) {
      displayMatrix.push(_lodash2["default"].fill(Array(displayMatrix[0].length), 0));
    }
  }

  // Finds the first [x, y] position in the widget grid large enough to fit
  // a widget of the submitted size. Check is performed from left to right and
  // top to bottom.
  , findEmptySpace: function findEmptySpace(displayMatrix, dimensions) {
    var newPos;
    var candidatePositions = [];

    // Check each existing row for a fit
    for (var i = 0; i < displayMatrix.length; i++) {
      var candidateIndexes = [];

      // Check each y index in the row to test (in this order) that it:
      // 1. Is empty
      // 2. Is not too close to the end of the array for the widget to fit
      // 3. Is followed by sufficient empty space for the widget to fit
      for (var j = 0; j < displayMatrix[i].length; j++) {
        if (displayMatrix[i][j] === 0 && typeof displayMatrix[i][j + dimensions[0] + this.props.gridGutter] !== "undefined" && _lodash2["default"].every(displayMatrix[i].slice(j, j + dimensions[0] + this.props.gridGutter), function (val) {
          return val === 0;
        })) {
          // If all the condtions are met, push this index as a candidate.
          candidateIndexes.push(j);
        }
      }

      // If any candidates were found, push the array of candidates in this
      // row to the two-dimensional array of candidate positions.
      if (candidateIndexes.length) {
        candidatePositions.push(candidateIndexes);
        // If no candidates were found, push null to to the array of rows.
        // This makes it much easier to tell when a position is inviable during
        // the y-axis check.
      } else {
        candidatePositions.push(null);
      }
    }

    // Check if there's a suitable space by checking for x indicies that are
    // in sufficient subsequent rows.
    for (var k = 0; k < candidatePositions.length; k++) {
      // Only check for shared candidate x indicies within the height needed
      // for the widget.
      var candidateRange = candidatePositions.slice(k, k + dimensions[1] + this.props.gridGutter);
      var winners;

      // Make sure there are any candidate x indicies in this row to test.
      if (_lodash2["default"].isArray(candidatePositions[k])) {
        // Only check for qualifying rows
        // if there are no null rows in the range
        if (_lodash2["default"].every(candidateRange, function (entry) {
          return _lodash2["default"].isArray(entry);
        })) {
          // If there's only one row with qualifiying indicies, you must be at
          // the bottom of the grid. Identify the first qualifiying x-index on
          // the bottom row as the winner. Extra vertical space is created
          // later in the function.
          if (candidateRange.length === 1) {
            winners = [candidateRange[0][0]];
            // Find the x indicies that are in all the candidate rows. This
            // indicates that the entire range of rows has enough space for a
            // widget of this size.
          } else {
            winners = _lodash2["default"].intersection.apply(this, candidateRange);
          }
          // If any rows in the range are not arrays (null), that means there's
          // no space at all for this widget in that row. At this point, you can
          // continue the loop with the next qualifying row, because this one
          // is certain to fail.
        } else {
          continue;
        }

        // If the intersection above produced any results, we have a winner.
        if (winners.length) {
          // It's possible for a winner to be too close to the bottom of the
          // grid to fit. In this case, add extra space.
          this.addEmptyRows(displayMatrix, Math.max(0, dimensions[1] + this.props.gridGutter - candidateRange.length));
          // Identify the actual new position as the first x-index in the
          // array of vertical intersections and leave the loop.
          newPos = [winners[0], k];
          break;
          // If the array of intersections was empty, there is not enough
          // vertical space in the candidate rows for this widget. Check for
          // candidates starting with the next row.
        } else {
          continue;
        }
        // If the reason there are no candidate x indicies to test in this row
        // is that there is no available space anywhere in the grid, add enough
        // rows to the grid to fit the entire widget and give the top left
        // coordinate of the new space as the new position.
      } else if (candidatePositions.length - 1 === k) {
        this.addEmptyRows(displayMatrix, dimensions[1] + this.props.gridGutter);
        newPos = [0, candidatePositions.length];
        break;
        // If the row is empty but not past the end of the grid,
        // try another row.
      } else {
        continue;
      }
    }

    return newPos;
  }

  // Find the positions where a widget of the specified position and
  // dimensions would intersect with another widget or its gutter.
  , findIntersections: function findIntersections(displayMatrix, position, dimensions) {
    var intersections = [];

    for (var i = position[1]; i < position[1] + dimensions[1] + this.props.gridGutter; i++) {
      intersections.push(displayMatrix[i].slice(position[0], position[0] + dimensions[0] + this.props.gridGutter));
    }

    return _lodash2["default"].without(_lodash2["default"].uniq(_lodash2["default"].flattenDeep(intersections)), 0);
  },

  createMatrixFootprint: function createMatrixFootprint(displayMatrix, position, dimensions, fillEntry) {
    for (var i = position[1]; i < position[1] + dimensions[1] + this.props.gridGutter; i++) {
      _lodash2["default"].fill(displayMatrix[i], fillEntry, position[0], position[0] + dimensions[0] + this.props.gridGutter);
    }
  }

  // Used when a new set of widgets is requested to create random widgets and
  // distribute them around the page as necessary.
  , initializeWidgets: function initializeWidgets() {
    var widgets = this.state.widgets;
    var toGridUnits = this.toGridUnits;
    var toPixels = this.toPixels;
    var findEmptySpace = this.findEmptySpace;
    var createMatrixFootprint = this.createMatrixFootprint;
    // The displayMatrix is a two-dimensional array in which empty positions
    // are represented as zeros and occupied ones are set to the UUID of the
    // widget occupying that space.
    var displayMatrix = [_lodash2["default"].fill(Array(this.calculateGridWidth()), 0)];

    _lodash2["default"].forEach(widgets, function (widget) {
      var dimensions = [toGridUnits(widget.dimensions[0]), toGridUnits(widget.dimensions[1])];
      var position = findEmptySpace(displayMatrix, dimensions);

      createMatrixFootprint(displayMatrix, position, dimensions, widget.id);

      widget.position = [];
      widget.position[0] = toPixels(position[0]);
      widget.position[1] = toPixels(position[1]);
    });

    this.setState({
      widgets: widgets,
      displayMatrix: displayMatrix
    });
  }

  // TODO:
  // Maybe this should be moved into some kind of utility class, and generalized
  , isServiceRunning: function isServiceRunning(service) {
    return _lodash2["default"].findIndex(this.state.servicesList, { name: service, state: "running" }) > -1;
  },

  render: function render() {
    if (this.isServiceRunning("collectd") === true) {
      return _react2["default"].createElement(
        "main",
        {
          ref: "thePlayground",
          onMouseMove: this.calculateMovement,
          className: "playground grid-on" },
        _react2["default"].createElement(
          "div",
          {
            ref: "widgetAreaRef",
            className: "widget-wrapper" },
          _react2["default"].createElement(_componentsWidgetsSystemInfo2["default"], {
            stacked: "true",
            title: "System Info",
            size: "m-rect",
            inMotion: this.state.movementMode && this.state.widgetInMotion && this.state.widgetInMotion.id === this.state.widgets.SystemInfo.id ? true : false,
            onMouseDownHolder: this.enterMovementMode.bind(this, this.state.widgets.SystemInfo.id),
            refHolder: "widget-" + this.state.widgets.SystemInfo.id,
            dimensions: this.state.widgets.SystemInfo.dimensions,
            position: this.state.widgets.SystemInfo.position,
            id: this.state.widgets.SystemInfo.id }),
          _react2["default"].createElement(_componentsWidgetsMemoryUtil2["default"], {
            title: "Memory Value",
            size: "m-rect",
            dimensions: this.state.widgets.MemoryUtil.dimensions,
            position: this.state.widgets.MemoryUtil.position,
            id: this.state.widgets.MemoryUtil.id }),
          _react2["default"].createElement(_componentsWidgetsCpuUtil2["default"], {
            primary: "pie",
            title: "CPU utilization",
            size: "m-rect",
            dimensions: this.state.widgets.CpuUtil.dimensions,
            position: this.state.widgets.CpuUtil.position,
            id: this.state.widgets.CpuUtil.id }),
          _react2["default"].createElement(_componentsWidgetsSystemLoad2["default"], {
            primary: "stacked",
            title: "System Load",
            size: "m-rect",
            dimensions: this.state.widgets.SystemLoad.dimensions,
            position: this.state.widgets.SystemLoad.position,
            id: this.state.widgets.SystemLoad.id }),
          _react2["default"].createElement(_componentsWidgetsNetworkUsage2["default"], {
            title: "Network Usage",
            size: "l-rect",
            graphType: "line",
            dimensions: this.state.widgets.NetworkUsage.dimensions,
            position: this.state.widgets.NetworkUsage.position,
            id: this.state.widgets.NetworkUsage.id }),
          _react2["default"].createElement(_componentsWidgetsDiskUsage2["default"], {
            title: "Disk Usage",
            size: "l-rect",
            graphType: "line",
            dimensions: this.state.widgets.DiskUsage.dimensions,
            position: this.state.widgets.DiskUsage.position,
            id: this.state.widgets.DiskUsage.id })
        )
      );
    } else {
      return _react2["default"].createElement(
        "main",
        null,
        _react2["default"].createElement(
          "h2",
          null,
          "Dashboard View"
        ),
        _react2["default"].createElement(
          "h3",
          null,
          "Please enable collectd service to display widgets."
        )
      );
    }
  }

});

exports["default"] = Dashboard;
module.exports = exports["default"];
//# sourceMappingURL=Dashboard.js.map