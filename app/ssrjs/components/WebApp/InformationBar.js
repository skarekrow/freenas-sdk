// Information Bar
// ===============
// Part of the main webapp's window chrome. Positioned on the right side of the
// page, this bar shows user-customizable content including graphs, logged in
// users, and other widgets.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var InformationBar = _react2["default"].createClass({
  displayName: "InformationBar",

  render: function render() {
    return _react2["default"].createElement("aside", { className: "app-sidebar information-bar" });
  }
});

module.exports = InformationBar;
//# sourceMappingURL=InformationBar.js.map
