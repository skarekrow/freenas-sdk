

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _middlewareSystemMiddleware = require("../../middleware/SystemMiddleware");

var _middlewareSystemMiddleware2 = _interopRequireDefault(_middlewareSystemMiddleware);

var _storesSystemStore = require("../../stores/SystemStore");

var _storesSystemStore2 = _interopRequireDefault(_storesSystemStore);

var _mixinsChartHandler = require("./mixins/chartHandler");

var _mixinsChartHandler2 = _interopRequireDefault(_mixinsChartHandler);

var _round = require("round");

var _round2 = _interopRequireDefault(_round);

var statdResources = [{
  variable: "wiredData",
  dataSource: "localhost.memory.memory-wired.value",
  name: "Wired Memory",
  color: "#f39400"
}, {
  variable: "cacheData",
  dataSource: "localhost.memory.memory-cache.value",
  name: "Cached Memory",
  color: "#8ac007"
}, {
  variable: "activeData",
  dataSource: "localhost.memory.memory-active.value",
  name: "Active Memory",
  color: "#c9d200"
}, {
  variable: "freeData",
  dataSource: "localhost.memory.memory-free.value",
  name: "Free Memory",
  color: "#5186ab"
}, {
  variable: "inactiveData",
  dataSource: "localhost.memory.memory-inactive.value",
  name: "Inactive Memory",
  color: "#b6d5e9"
}];

var MemoryUtil = _react2["default"].createClass({
  displayName: "MemoryUtil",

  mixins: [_mixinsChartHandler2["default"]],

  getInitialState: function getInitialState() {
    return { hardware: _storesSystemStore2["default"].getSystemInfo("hardware"),
      statdResources: statdResources,
      chartTypes: [],
      widgetIdentifier: "MemoryUtil"

    };
  },

  componentDidMount: function componentDidMount() {
    _storesSystemStore2["default"].addChangeListener(this.handleChange);

    _middlewareSystemMiddleware2["default"].requestSystemInfo("hardware");
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesSystemStore2["default"].removeChangeListener(this.handleChange);
  },

  primaryChart: function primaryChart(type) {
    if (this.props.primary === undefined && type === "line") {
      return true;
    } else if (type === this.props.primary) {
      return true;
    } else {
      return false;
    }
  },

  handleChange: function handleChange() {
    var newState = {};
    newState.hardware = _storesSystemStore2["default"].getSystemInfo("hardware");

    if (newState.hardware) {

      newState.chartTypes = [{
        type: "stacked",
        primary: this.primaryChart("stacked"),
        y: function y(d) {
          return (0, _round2["default"])(d[1] / 1024 / 1024, 0.01);
        }
      }, {
        type: "line",
        primary: this.primaryChart("line"),
        forceY: [0, 100],
        yUnit: "%",
        y: (function (d) {
          return (0, _round2["default"])(d[1] / newState.hardware["memory-size"] * 100, 0.01);
        }).bind(this)
      }, {
        type: "pie",
        primary: this.primaryChart("pie")
      }];

      this.setState(newState);
    }
  }

});

module.exports = MemoryUtil;
//# sourceMappingURL=MemoryUtil.js.map