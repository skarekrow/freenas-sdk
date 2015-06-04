

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mixinsChartHandler = require("./mixins/chartHandler");

var _mixinsChartHandler2 = _interopRequireDefault(_mixinsChartHandler);

var _round = require("round");

var _round2 = _interopRequireDefault(_round);

var CpuUtil = _react2["default"].createClass({
  displayName: "CpuUtil",

  mixins: [_mixinsChartHandler2["default"]],

  getInitialState: function getInitialState() {
    var dataSrc = "localhost.aggregation-cpu-sum.";
    return {
      statdResources: [{ variable: "system",
        dataSource: dataSrc + "cpu-system.value",
        name: "System",
        color: "#9ecc3c" }, { variable: "user",
        dataSource: dataSrc + "cpu-user.value",
        name: "User",
        color: "#77c5d5" }, { variable: "nice",
        dataSource: dataSrc + "cpu-nice.value",
        name: "Nice",
        color: "#ffdb1a" }, { variable: "idle",
        dataSource: dataSrc + "cpu-idle.value",
        name: "Idle",
        color: "#ed8b00" }, { variable: "interrupt",
        dataSource: dataSrc + "cpu-interrupt.value",
        name: "Interrupt",
        color: "#cc3c3c" }],
      chartTypes: [{ type: "line",
        primary: this.primaryChart("line"),
        y: function y(d) {
          return (0, _round2["default"])(d[1], 0.01);
        }
      }, { type: "pie",
        primary: this.primaryChart("pie")
      }],
      widgetIdentifier: "CpuUtil"
    };
  },

  primaryChart: function primaryChart(type) {
    if (this.props.primary === undefined && type === "line") {
      return true;
    } else if (type === this.props.primary) {
      return true;
    } else {
      return false;
    }
  }
});

module.exports = CpuUtil;
//# sourceMappingURL=CpuUtil.js.map