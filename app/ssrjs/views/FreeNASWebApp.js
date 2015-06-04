// Main App Wrapper
// ================
// Top level controller-view for FreeNAS webapp

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

// WebApp Components

var _componentsBusyBox = require("../components/BusyBox");

var _componentsBusyBox2 = _interopRequireDefault(_componentsBusyBox);

var _componentsWebAppNotificationBar = require("../components/WebApp/NotificationBar");

var _componentsWebAppNotificationBar2 = _interopRequireDefault(_componentsWebAppNotificationBar);

var _componentsWebAppInformationBar = require("../components/WebApp/InformationBar");

var _componentsWebAppInformationBar2 = _interopRequireDefault(_componentsWebAppInformationBar);

var _componentsPrimaryNavigation = require("../components/PrimaryNavigation");

var _componentsPrimaryNavigation2 = _interopRequireDefault(_componentsPrimaryNavigation);

var _componentsDebugTools = require("../components/DebugTools");

var _componentsDebugTools2 = _interopRequireDefault(_componentsDebugTools);

var FreeNASWebApp = _react2["default"].createClass({
  displayName: "FreeNASWebApp",

  mixins: [_componentsMixinsRouterShim2["default"]],

  componentDidMount: function componentDidMount() {
    this.calculateDefaultRoute("/", "dashboard", "is");
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    this.calculateDefaultRoute("/", "dashboard", "is");
  },

  render: function render() {

    return _react2["default"].createElement(
      "div",
      { className: "app-wrapper" },
      _react2["default"].createElement(_componentsBusyBox2["default"], null),
      _react2["default"].createElement(_componentsWebAppNotificationBar2["default"], null),
      _react2["default"].createElement(
        "div",
        { className: "app-content" },
        _react2["default"].createElement(_componentsPrimaryNavigation2["default"], null),
        _react2["default"].createElement(_reactRouter.RouteHandler, null),
        _react2["default"].createElement(_componentsWebAppInformationBar2["default"], null)
      ),
      _react2["default"].createElement("footer", { className: "app-footer" }),
      _react2["default"].createElement(_componentsDebugTools2["default"], null)
    );
  }

});

exports["default"] = FreeNASWebApp;
module.exports = exports["default"];
/* TODO: Add Modal mount div */ /* Modal windows for busy spinner and/or FreeNAS login
                                     -- hidden normally except when invoked*/ /* Header containing system status and information */ /* Primary navigation menu */ /* Primary view */ /* User-customizable component showing system events */
//# sourceMappingURL=FreeNASWebApp.js.map