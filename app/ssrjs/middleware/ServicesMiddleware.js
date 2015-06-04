// Services Middleware
// ===================

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

var _actionsServicesActionCreators = require("../actions/ServicesActionCreators");

var _actionsServicesActionCreators2 = _interopRequireDefault(_actionsServicesActionCreators);

var ServicesMiddleware = (function (_AbstractBase) {
  function ServicesMiddleware() {
    _classCallCheck(this, ServicesMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(ServicesMiddleware, _AbstractBase);

  _createClass(ServicesMiddleware, null, [{
    key: "subscribeToTask",
    value: function subscribeToTask(componentID) {
      _MiddlewareClient2["default"].subscribe(["task.*"], componentID);
    }
  }, {
    key: "unsubscribeFromTask",
    value: function unsubscribeFromTask(componentID) {
      _MiddlewareClient2["default"].unsubscribe(["task.*"], componentID);
    }
  }, {
    key: "updateService",
    value: function updateService(serviceName, action) {
      _MiddlewareClient2["default"].request("task.submit", ["service.manage", [serviceName, action]], function handleUpdateService(taskID) {
        _actionsServicesActionCreators2["default"].receiveServiceUpdateTask(taskID, serviceName);
      });
    }
  }, {
    key: "configureService",
    value: function configureService(serviceName, configArray) {
      _MiddlewareClient2["default"].request("task.submit", ["service.configure", [serviceName, configArray]], function handleUpdateService(taskID) {
        _actionsServicesActionCreators2["default"].receiveServiceUpdateTask(taskID, serviceName);
      });
    }
  }, {
    key: "requestServicesList",
    value: function requestServicesList() {
      _MiddlewareClient2["default"].request("services.query", [], function (rawServicesList) {
        _actionsServicesActionCreators2["default"].receiveServicesList(rawServicesList);
      });
    }
  }]);

  return ServicesMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = ServicesMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=ServicesMiddleware.js.map