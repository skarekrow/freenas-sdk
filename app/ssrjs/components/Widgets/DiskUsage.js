

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _middlewareZfsMiddleware = require("../../middleware/ZfsMiddleware");

var _middlewareZfsMiddleware2 = _interopRequireDefault(_middlewareZfsMiddleware);

var _storesZfsStore = require("../../stores/ZfsStore");

var _storesZfsStore2 = _interopRequireDefault(_storesZfsStore);

var _mixinsChartHandler = require("./mixins/chartHandler");

var _mixinsChartHandler2 = _interopRequireDefault(_mixinsChartHandler);

var _round = require("round");

var _round2 = _interopRequireDefault(_round);

var DiskUsage = _react2["default"].createClass({
  displayName: "DiskUsage",

  mixins: [_mixinsChartHandler2["default"]],

  getInitialState: function getInitialState() {
    return {
      pool: _storesZfsStore2["default"].getZfsPoolGetDisks("freenas-boot"),
      statdResources: [],
      chartTypes: [{ type: "line",
        primary: this.primaryChart("line"),
        y: function y(d) {
          return (0, _round2["default"])(d[1] / 1024, 0.01);
        }
      }],
      widgetIdentifier: "DiskUsage"
    };
  },

  componentDidMount: function componentDidMount() {
    _storesZfsStore2["default"].addChangeListener(this.handleChange);
    _middlewareZfsMiddleware2["default"].requestZfsPoolGetDisks("freenas-boot");
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesZfsStore2["default"].removeChangeListener(this.handleChange);
  },

  handleChange: function handleChange() {
    var newState = {};
    newState.pool = _storesZfsStore2["default"].getZfsPoolGetDisks("freenas-boot");

    if (newState.pool) {
      var systemPoolPath = newState.pool[0].split("/");
      var systemPoolName = systemPoolPath[systemPoolPath.length - 1].slice(0, systemPoolPath[systemPoolPath.length - 1].indexOf("p"));

      newState.statdResources = [{ variable: "write",
        dataSource: "localhost.disk-" + systemPoolName + ".disk_octets.write",
        name: systemPoolName + " Write",
        color: "#9ecc3c"
      }, { variable: "read",
        dataSource: "localhost.disk-" + systemPoolName + ".disk_octets.read",
        name: systemPoolName + " Read",
        color: "#77c5d5"
      }];
      this.setState(newState);
    }
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

module.exports = DiskUsage;
//# sourceMappingURL=DiskUsage.js.map