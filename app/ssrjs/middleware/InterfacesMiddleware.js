// Interfaces Middleware
// =====================

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _MiddlewareClient = require("./MiddlewareClient");

var _MiddlewareClient2 = _interopRequireDefault(_MiddlewareClient);

var _MiddlewareAbstract = require("./MiddlewareAbstract");

var _MiddlewareAbstract2 = _interopRequireDefault(_MiddlewareAbstract);

var _actionsInterfacesActionCreators = require("../actions/InterfacesActionCreators");

var _actionsInterfacesActionCreators2 = _interopRequireDefault(_actionsInterfacesActionCreators);

var InterfacesMiddleware = (function (_AbstractBase) {
  function InterfacesMiddleware() {
    _classCallCheck(this, InterfacesMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(InterfacesMiddleware, _AbstractBase);

  _createClass(InterfacesMiddleware, null, [{
    key: "subscribe",
    value: function subscribe(componentID) {
      _MiddlewareClient2["default"].subscribe(["network.interface.*"], componentID);
      _MiddlewareClient2["default"].subscribe(["task.*"], componentID);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(componentID) {
      _MiddlewareClient2["default"].unsubscribe(["network.interface.*"], componentID);
      _MiddlewareClient2["default"].unsubscribe(["task.*"], componentID);
    }
  }, {
    key: "requestInterfacesList",
    value: function requestInterfacesList() {
      _MiddlewareClient2["default"].request("network.interfaces.query", [], function handleRequestInterfacesList(rawInterfacesList) {
        _actionsInterfacesActionCreators2["default"].receiveInterfacesList(rawInterfacesList);
      });
    }
  }, {
    key: "configureInterface",
    value: function configureInterface(interfaceName, props) {
      _MiddlewareClient2["default"].request("task.submit", ["network.interface.configure", [interfaceName, props]], function handleConfigureInterface(taskID, interfaceName) {
        _actionsInterfacesActionCreators2["default"].receiveInterfaceConfigureTask(taskID, interfaceName);
      });
    }
  }]);

  return InterfacesMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = InterfacesMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=InterfacesMiddleware.js.map
