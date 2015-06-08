// System Info Data Middleware
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

var _actionsSystemActionCreators = require("../actions/SystemActionCreators");

var _actionsSystemActionCreators2 = _interopRequireDefault(_actionsSystemActionCreators);

var SystemMiddleware = (function (_AbstractBase) {
  function SystemMiddleware() {
    _classCallCheck(this, SystemMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(SystemMiddleware, _AbstractBase);

  _createClass(SystemMiddleware, null, [{
    key: "requestSystemInfo",
    value: function requestSystemInfo(namespace) {
      _MiddlewareClient2["default"].request("system.info." + namespace, [], function handleSystemInfo(systemInfo) {
        _actionsSystemActionCreators2["default"].receiveSystemInfo(systemInfo, namespace);
      });
    }
  }, {
    key: "requestSystemDevice",
    value: function requestSystemDevice(arg) {
      _MiddlewareClient2["default"].request("system.device.get_devices", [arg], function handleSystemDevice(systemDevice) {
        _actionsSystemActionCreators2["default"].receiveSystemDevice(systemDevice, arg);
      });
    }
  }]);

  return SystemMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = SystemMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=SystemMiddleware.js.map
