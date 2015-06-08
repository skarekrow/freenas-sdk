// Power Middleware
// ================
// Provides abstraction functions that queue systems tasks to the middleware
// i.e. shutdown, reboot, etc

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

// Cookies!

var _cookies = require("./cookies");

var _cookies2 = _interopRequireDefault(_cookies);

var PowerMiddleware = (function (_AbstractBase) {
  function PowerMiddleware() {
    _classCallCheck(this, PowerMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(PowerMiddleware, _AbstractBase);

  _createClass(PowerMiddleware, null, [{
    key: "subscribe",
    value: function subscribe(componentID) {
      _MiddlewareClient2["default"].subscribe(["power.changed", "update.changed"], componentID);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(componentID) {
      _MiddlewareClient2["default"].unsubscribe(["power.changed", "update.changed"], componentID);
    }
  }, {
    key: "reboot",
    value: function reboot() {
      _MiddlewareClient2["default"].request("task.submit", ["system.reboot", ""], function handleReboot() {
        _cookies2["default"]["delete"]("auth");
      });
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      _MiddlewareClient2["default"].request("task.submit", ["system.shutdown", ""], function handleShutdown() {
        _cookies2["default"]["delete"]("auth");
      });
    }
  }]);

  return PowerMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = PowerMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=PowerMiddleware.js.map
