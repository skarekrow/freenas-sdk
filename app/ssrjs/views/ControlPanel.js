// Control Panel
// ================
// Consolidated view containing global options for all other parts of FreeNAS.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var ControlPanel = _react2["default"].createClass({
  displayName: "ControlPanel",

  render: function render() {
    return _react2["default"].createElement(
      "main",
      null,
      _react2["default"].createElement(
        "h1",
        null,
        "Control Panel View"
      )
    );
  }
});

exports["default"] = ControlPanel;
module.exports = exports["default"];
//# sourceMappingURL=ControlPanel.js.map