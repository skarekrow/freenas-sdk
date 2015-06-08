// ROUTER SHIM
// ===========
// Helper mixins designed to shim react-router with some helpful functionality.
// Offers simple getter and redirect methods based on simple, semantic
// expressions.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

module.exports = {

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  routeEndsWith: function routeEndsWith(route) {
    var rc = this.context.router;

    return _lodash2["default"].endsWith(rc.getCurrentPathname(), route);
  },

  routeIs: function routeIs(route) {
    var rc = this.context.router;

    return rc.getCurrentPathname() === route;
  },

  calculateDefaultRoute: function calculateDefaultRoute(testRoute, target, testType) {
    var rc = this.context.router;
    var testString = testType.toLowerCase();
    var shouldRedirect;

    switch (testString) {
      case "routeis":
      case "is":
        shouldRedirect = this.routeIs(testRoute);
        break;

      case "routeendswith":
      case "endswith":
        shouldRedirect = this.routeEndsWith(testRoute);
        break;

      default:
        shouldRedirect = this.routeEndsWith(testRoute);
        break;
    }

    if (shouldRedirect) {
      rc.replaceWith(target);
    }
  },

  getDynamicRoute: function getDynamicRoute() {
    var rc = this.context.router;

    return rc.getCurrentParams()[this.props.viewData.routing["param"]];
  }

};
//# sourceMappingURL=routerShim.js.map
