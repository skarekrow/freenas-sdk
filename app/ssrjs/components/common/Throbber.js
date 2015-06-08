// Throbber
// ========

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var Throbber = _react2["default"].createClass({
  displayName: "Throbber",
  propTypes: { bsStyle: _react2["default"].PropTypes.oneOf(["primary", "info", "danger", "warning", "success"]),
    size: _react2["default"].PropTypes.number,
    className: _react2["default"].PropTypes.string
  },

  render: function render() {
    var throbberSize = this.props.size ? { height: this.props.size + "px",
      width: this.props.size + "px" } : null;
    var bsStyle = this.props.bsStyle ? " throbber-" + this.props.bsStyle : "";
    var throbberClass = this.props.className ? " " + this.props.className : "";

    return _react2["default"].createElement(
      "div",
      { className: "throbber" + bsStyle + throbberClass },
      _react2["default"].createElement("span", { className: "throbber-inner", style: throbberSize })
    );
  }

});

module.exports = Throbber;
//# sourceMappingURL=Throbber.js.map
