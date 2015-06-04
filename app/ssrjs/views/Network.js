// Network
// =======

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

var componentLongName = "Networks";

var sections = [{ route: "network-config",
  display: "Network Overview"
}, { route: "interfaces",
  display: "Interfaces"
}, { display: "LAGGs" }, { display: "Routes" }, { display: "VLANs" }];

var Network = _react2["default"].createClass({

  displayName: "Network",

  mixins: [_componentsMixinsRouterShim2["default"]],

  componentDidMount: function componentDidMount() {
    this.calculateDefaultRoute("network", "network-config", "endsWith");
  },

  componentWillUpdate: function componentWillUpdate(prevProps, prevState) {
    this.calculateDefaultRoute("network", "network-config", "endsWith");
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

exports["default"] = Network;
module.exports = exports["default"];
//# sourceMappingURL=Network.js.map