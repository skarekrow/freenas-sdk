// Network Config Middleware
// =========================

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _MiddlewareClient = require("./MiddlewareClient");

var _MiddlewareClient2 = _interopRequireDefault(_MiddlewareClient);

var _MiddlewareAbstract = require("./MiddlewareAbstract");

var _MiddlewareAbstract2 = _interopRequireDefault(_MiddlewareAbstract);

var _actionsNetworkConfigActionCreators = require("../actions/NetworkConfigActionCreators");

var _actionsNetworkConfigActionCreators2 = _interopRequireDefault(_actionsNetworkConfigActionCreators);

var NetworkConfigMiddleware = (function () {
  function NetworkConfigMiddleware() {
    _classCallCheck(this, NetworkConfigMiddleware);
  }

  _createClass(NetworkConfigMiddleware, null, [{
    key: "subscribe",
    value: function subscribe(componentID) {
      _MiddlewareClient2["default"].subscribe(["network.changed"], componentID);
      _MiddlewareClient2["default"].subscribe(["task.*"], componentID);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(componentID) {
      _MiddlewareClient2["default"].unsubscribe(["network.changed"], componentID);
      _MiddlewareClient2["default"].unsubscribe(["task.*"], componentID);
    }
  }, {
    key: "requestNetworkConfig",
    value: function requestNetworkConfig() {
      _MiddlewareClient2["default"].request("network.config.get_global_config", [], function handleRequestNetworkConfig(networkConfig) {
        _actionsNetworkConfigActionCreators2["default"].receiveNetworkConfig(networkConfig);
      });
    }
  }, {
    key: "updateNetworkConfig",
    value: function updateNetworkConfig(newNetworkConfig) {
      _MiddlewareClient2["default"].request("task.submit", ["network.configure"], function handleUpdateConfig(taskID) {
        _actionsNetworkConfigActionCreators2["default"].receiveNetworkUpdateTask(taskID);
      });
    }
  }]);

  return NetworkConfigMiddleware;
})();

;

exports["default"] = NetworkConfigMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=NetworkConfigMiddleware.js.map