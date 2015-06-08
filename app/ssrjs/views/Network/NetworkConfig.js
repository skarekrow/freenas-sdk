// Network Configuration Overview
// ==============================

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _middlewareNetworkConfigMiddleware = require("../../middleware/NetworkConfigMiddleware");

var _middlewareNetworkConfigMiddleware2 = _interopRequireDefault(_middlewareNetworkConfigMiddleware);

var _storesNetworkConfigStore = require("../../stores/NetworkConfigStore");

var _storesNetworkConfigStore2 = _interopRequireDefault(_storesNetworkConfigStore);

var _componentsIcon = require("../../components/Icon");

var _componentsIcon2 = _interopRequireDefault(_componentsIcon);

var componentLongName = "NetworkConfig";

var NetworkConfig = _react2["default"].createClass({
  displayName: "NetworkConfig",

  getInitialState: function getInitialState() {
    return this.getNetworkConfigFromStore();
  },

  componentDidMount: function componentDidMount() {
    _storesNetworkConfigStore2["default"].addChangeListener(this.handleConfigChange);
    _middlewareNetworkConfigMiddleware2["default"].requestNetworkConfig();
    _middlewareNetworkConfigMiddleware2["default"].subscribe(componentLongName);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesNetworkConfigStore2["default"].removeChangeListener(this.handleConfigChange);
    _middlewareNetworkConfigMiddleware2["default"].unsubscribe(componentLongName);
  },

  getNetworkConfigFromStore: function getNetworkConfigFromStore() {
    return { networkConfig: _storesNetworkConfigStore2["default"].getNetworkConfig() };
  },

  handleConfigChange: function handleConfigChange() {
    this.setState(this.getNetworkConfigFromStore());
  },

  render: function render() {
    var dhcpGatewayIcon = "";
    var dhcpDNSIcon = "";
    var gatewayIPv4 = "";
    var gatewayIPv6 = "";

    if (!_lodash2["default"].isEmpty(this.state.networkConfig)) {
      dhcpGatewayIcon = this.state.networkConfig.dhcp["assign_gateway"] ? "check text-primary" : "times text-muted";

      dhcpDNSIcon = this.state.networkConfig.dhcp["assign_dns"] ? "check text-primary" : "times text-muted";

      gatewayIPv4 = this.state.networkConfig.gateway.ipv4 ? this.state.gateway.ipv4 : "--";

      gatewayIPv6 = this.state.networkConfig.gateway.ipv6 ? this.state.networkConfig.gateway.ipv6 : "--";
    }

    return _react2["default"].createElement(
      "main",
      null,
      _react2["default"].createElement(
        "div",
        { className: "network-config container-fluid" },
        _react2["default"].createElement(
          _reactBootstrap2["default"].PanelGroup,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Panel,
            null,
            "DHCP",
            _react2["default"].createElement(
              _reactBootstrap2["default"].ListGroup,
              { fill: true },
              _react2["default"].createElement(
                _reactBootstrap2["default"].ListGroupItem,
                { className: "network-attribute" },
                "Assign DNS ",
                _react2["default"].createElement(_componentsIcon2["default"], { glyph: dhcpDNSIcon })
              ),
              _react2["default"].createElement(
                _reactBootstrap2["default"].ListGroupItem,
                { className: "network-attribute" },
                "Assign Gateway ",
                _react2["default"].createElement(_componentsIcon2["default"], { glyph: dhcpGatewayIcon })
              )
            )
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].Panel,
            null,
            "Default Gateways",
            _react2["default"].createElement(
              _reactBootstrap2["default"].ListGroup,
              { fill: true },
              _react2["default"].createElement(
                _reactBootstrap2["default"].ListGroupItem,
                { className: "network-attribute" },
                "IPv4 Default Gateway: ",
                gatewayIPv4
              ),
              _react2["default"].createElement(
                _reactBootstrap2["default"].ListGroupItem,
                { className: "network-attribute" },
                "IPv6 Default Gateway: ",
                gatewayIPv6
              )
            )
          )
        )
      )
    );
  }

});

exports["default"] = NetworkConfig;
module.exports = exports["default"];
//# sourceMappingURL=NetworkConfig.js.map
