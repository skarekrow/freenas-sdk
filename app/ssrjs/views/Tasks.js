// Tasks
// =====
// View containing information about all scheduled tasks, cronjobs, scrubs, etc

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var Tasks = _react2["default"].createClass({
  displayName: "Tasks",

  render: function render() {
    return _react2["default"].createElement(
      "main",
      null,
      _react2["default"].createElement(
        "h2",
        null,
        "Tasks View"
      )
    );
  }
});

exports["default"] = Tasks;
module.exports = exports["default"];
//# sourceMappingURL=Tasks.js.map