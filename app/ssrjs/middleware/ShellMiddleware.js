// Shell Middleware
// ================
// Utility methods for accessing shells through the Middleware Server.

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

var ShellMiddleware = (function (_AbstractBase) {
  function ShellMiddleware() {
    _classCallCheck(this, ShellMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(ShellMiddleware, _AbstractBase);

  _createClass(ShellMiddleware, null, [{
    key: "requestAvailableShells",
    value: function requestAvailableShells(callback) {
      _MiddlewareClient2["default"].request("shell.get_shells", null, callback);
    }
  }, {
    key: "spawnShell",
    value: function spawnShell(shellType, callback) {
      _MiddlewareClient2["default"].request("shell.spawn", [shellType], callback);
    }
  }]);

  return ShellMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = ShellMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=ShellMiddleware.js.map