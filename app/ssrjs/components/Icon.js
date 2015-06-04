

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var Icon = _react2["default"].createClass({
  displayName: "Icon",

  propTypes: {
    glyph: _react2["default"].PropTypes.string.isRequired,
    icoSize: _react2["default"].PropTypes.string,
    icoClass: _react2["default"].PropTypes.string,
    className: _react2["default"].PropTypes.string,
    badgeStyle: _react2["default"].PropTypes.string,
    badgeContent: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.number, _react2["default"].PropTypes.bool])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      icoSize: null,
      icoClass: null,
      bsBadgeStyle: "info"
    };
  },

  render: function render() {
    var iconBadge = null;

    if (this.props.badgeContent) {
      iconBadge = _react2["default"].createElement(
        "span",
        { className: "badge" },
        this.props.badgeContent
      );
    }

    return _react2["default"].createElement(
      "i",
      { onClick: this.props.onClick,
        className: _lodash2["default"].without(["fa", "fa-" + this.props.glyph, this.props.className, "badge-" + this.props.bsBadgeStyle, this.props.icoClass], null).join(" "),
        style: { fontSize: this.props.icoSize } },
      iconBadge
    );
  }
});

module.exports = Icon;
//# sourceMappingURL=Icon.js.map