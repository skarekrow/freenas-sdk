// SECTION NAV
// ================
// Component for managing multiple views side by side

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _reactRouter = require("react-router");

var SectionNav = _react2["default"].createClass({
  displayName: "SectionNav",
  propTypes: {
    views: _react2["default"].PropTypes.array
  },

  createNavItems: function createNavItems(item, index) {
    var navItem = undefined;

    if (item.disabled || !item.route) {
      navItem = _react2["default"].createElement(
        "a",
        {
          key: index,
          className: "btn btn-default disabled",
          role: "button",
          href: "#" },
        item.display
      );
    } else {
      navItem = _react2["default"].createElement(
        _reactRouter.Link,
        {
          to: item.route,
          key: index,
          className: "btn btn-default",
          activeClassName: "active btn-info",
          role: "button",
          type: "button" },
        item.display
      );
    }

    return navItem;
  },

  render: function render() {
    var viewNum = this.props.views.length;
    if (viewNum > 1) {
      return _react2["default"].createElement(
        _reactBootstrap2["default"].Grid,
        { fluid: true },
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          { className: "text-center" },
          _react2["default"].createElement(
            _reactBootstrap2["default"].ButtonGroup,
            { bsSize: "large" },
            this.props.views.map(this.createNavItems)
          )
        )
      );
    } else {
      console.warn("A SectionNav is being called with " + viewNum === 1 ? "only one view" : "no views");
      return null;
    }
  }
});

exports["default"] = SectionNav;
module.exports = exports["default"];
//# sourceMappingURL=SectionNav.js.map