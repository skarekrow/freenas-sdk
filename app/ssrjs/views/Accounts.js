// Users and Groups
// ================
// View showing all users and groups.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _componentsMixinsRouterShim = require("../components/mixins/routerShim");

var _componentsMixinsRouterShim2 = _interopRequireDefault(_componentsMixinsRouterShim);

var _componentsSectionNav = require("../components/SectionNav");

var _componentsSectionNav2 = _interopRequireDefault(_componentsSectionNav);

var sections = [{ route: "users",
  display: "Users"
}, { route: "groups",
  display: "Groups"
}];

var Accounts = _react2["default"].createClass({

  displayName: "Accounts",

  mixins: [_componentsMixinsRouterShim2["default"]],

  componentDidMount: function componentDidMount() {
    this.calculateDefaultRoute("accounts", "users", "endsWith");
  },

  componentWillUpdate: function componentWillUpdate(prevProps, prevState) {
    this.calculateDefaultRoute("accounts", "users", "endsWith");
  },

  render: function render() {
    return _react2["default"].createElement(
      "main",
      null,
      _react2["default"].createElement(_componentsSectionNav2["default"], { views: sections }),
      _react2["default"].createElement(_reactRouter.RouteHandler, null)
    );
  }
});

exports["default"] = Accounts;
module.exports = exports["default"];
//# sourceMappingURL=Accounts.js.map
