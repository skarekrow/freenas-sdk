// Power
// =======
//

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _middlewarePowerMiddleware = require("../middleware/PowerMiddleware");

var _middlewarePowerMiddleware2 = _interopRequireDefault(_middlewarePowerMiddleware);

var _componentsIcon = require("../components/Icon");

var _componentsIcon2 = _interopRequireDefault(_componentsIcon);

var _componentsCommonConfDialog = require("../components/common/ConfDialog");

var _componentsCommonConfDialog2 = _interopRequireDefault(_componentsCommonConfDialog);

var Power = _react2["default"].createClass({
  displayName: "Power",

  handlerebootbutton: function handlerebootbutton() {
    _middlewarePowerMiddleware2["default"].reboot();
  },

  handleshutdownbutton: function handleshutdownbutton() {
    _middlewarePowerMiddleware2["default"].shutdown();
  },

  render: function render() {
    var rebootprops = {};
    rebootprops.dataText = _react2["default"].createElement(
      "div",
      { style: { margin: "5px",
          cursor: "pointer" } },
      _react2["default"].createElement(_componentsIcon2["default"], { glyph: "refresh",
        icoSize: "4em" }),
      _react2["default"].createElement("br", null),
      "Reboot"
    );
    rebootprops.title = "Confirm Reboot";
    rebootprops.bodyText = "Are you sure you wish to reboot?";
    rebootprops.callFunc = this.handlerebootbutton;
    var shutdownprops = {};
    shutdownprops.dataText = _react2["default"].createElement(
      "div",
      { style: { margin: "5px",
          cursor: "pointer" } },
      _react2["default"].createElement(_componentsIcon2["default"], { glyph: "power-off",
        icoSize: "4em" }),
      _react2["default"].createElement("br", null),
      "Shutdown"
    );
    shutdownprops.title = "Confirm Shutdown";
    shutdownprops.bodyText = "Are you sure you wish to Shutdown?";
    shutdownprops.callFunc = this.handleshutdownbutton;
    return _react2["default"].createElement(
      "main",
      null,
      _react2["default"].createElement(
        "h2",
        null,
        "Power View"
      ),
      _react2["default"].createElement(_componentsCommonConfDialog2["default"], rebootprops),
      _react2["default"].createElement(_componentsCommonConfDialog2["default"], shutdownprops)
    );
  }
});

exports["default"] = Power;
module.exports = exports["default"];
//# sourceMappingURL=Power.js.map
