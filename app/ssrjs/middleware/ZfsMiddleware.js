// ZFS Pool Middleware
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

var _actionsZfsActionCreators = require("../actions/ZfsActionCreators");

var _actionsZfsActionCreators2 = _interopRequireDefault(_actionsZfsActionCreators);

var ZfsMiddleware = (function (_AbstractBase) {
  function ZfsMiddleware() {
    _classCallCheck(this, ZfsMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(ZfsMiddleware, _AbstractBase);

  _createClass(ZfsMiddleware, null, [{
    key: "requestZfsPool",
    value: function requestZfsPool(poolName) {
      _MiddlewareClient2["default"].request("zfs.pool." + poolName, [], function handleZfsPool(response) {
        _actionsZfsActionCreators2["default"].receiveZfsPool(response, poolName);
      });
    }
  }, {
    key: "requestZfsBootPool",
    value: function requestZfsBootPool(bootPoolArg) {
      _MiddlewareClient2["default"].request("zfs.pool.get_disks", [bootPoolArg], function handleZfsBootPool(response) {
        _actionsZfsActionCreators2["default"].receiveZfsBootPool(response, bootPoolArg);
      });
    }
  }, {
    key: "requestZfsPoolGetDisks",
    value: function requestZfsPoolGetDisks(zfsPoolArg) {
      _MiddlewareClient2["default"].request("zfs.pool.get_disks", [zfsPoolArg], function handleZfsPoolDisks(response) {
        _actionsZfsActionCreators2["default"].receiveZfsPoolGetDisks(response, zfsPoolArg);
      });
    }
  }]);

  return ZfsMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = ZfsMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=ZfsMiddleware.js.map