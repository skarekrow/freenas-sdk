

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _middlewareSystemMiddleware = require("../../middleware/SystemMiddleware");

var _middlewareSystemMiddleware2 = _interopRequireDefault(_middlewareSystemMiddleware);

var _storesSystemStore = require("../../stores/SystemStore");

var _storesSystemStore2 = _interopRequireDefault(_storesSystemStore);

var _mixinsChartHandler = require("./mixins/chartHandler");

var _mixinsChartHandler2 = _interopRequireDefault(_mixinsChartHandler);

var _round = require("round");

var _round2 = _interopRequireDefault(_round);

var React = require("react");

var NetworkUsage = React.createClass({
  displayName: "NetworkUsage",

  mixins: [_mixinsChartHandler2["default"]],

  getInitialState: function getInitialState() {
    return {
      network: _storesSystemStore2["default"].getSystemDevice("network"),
      statdResources: [],
      chartTypes: [{ type: "stacked",
        primary: false,
        y: function y(d) {
          return (0, _round2["default"])(d[1] / 1024, 0.01);
        }
      }, { type: "line",
        primary: true,
        y: function y(d) {
          return (0, _round2["default"])(d[1] / 1024, 0.01);
        },
        yUnit: ""
      }],
      widgetIdentifier: "NetworkUsage"
    };
  },
  componentDidMount: function componentDidMount() {
    _storesSystemStore2["default"].addChangeListener(this.handleChange);
    _middlewareSystemMiddleware2["default"].requestSystemDevice("network");
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesSystemStore2["default"].removeChangeListener(this.handleChange);
  },

  handleChange: function handleChange() {
    var newState = {};
    newState.network = _storesSystemStore2["default"].getSystemDevice("network");

    if (newState.network) {
      var iface = newState.network[0]["name"];
      newState.statdResources = [{
        variable: "octetsRx",
        dataSource: "localhost.interface-" + iface + ".if_octets.rx",
        name: "Data Receive (kB/s)",
        color: "#3C696E",
        area: true
      }, {
        variable: "octetsTx",
        dataSource: "localhost.interface-" + iface + ".if_octets.tx",
        name: "Data Transmit  (kB/s)",
        color: "#368D97",
        area: true
      }, {
        variable: "packetsRx",
        dataSource: "localhost.interface-" + iface + ".if_packets.rx",
        name: "Packets Receive",
        color: "#A8E077",
        area: true
      }, {
        variable: "packetsTx",
        dataSource: "localhost.interface-" + iface + ".if_packets.tx",
        name: "Packets Transmit",
        color: "#D9E35D",
        area: true
      }, {
        variable: "errorsTx",
        dataSource: "localhost.interface-" + iface + ".if_errors.rx",
        name: "Errors Receive",
        color: "#C9653A"
      }, {
        variable: "errorsRx",
        dataSource: "localhost.interface-" + iface + ".if_errors.tx",
        name: "Errors Transmit",
        color: "#BE6F6F"
      }];

      this.setState(newState);
    }
  }

});

module.exports = NetworkUsage;
//# sourceMappingURL=NetworkUsage.js.map
