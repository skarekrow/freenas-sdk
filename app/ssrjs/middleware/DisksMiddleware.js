// Disks Middleware
// ================

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _MiddlewareClient = require("./MiddlewareClient");

var _MiddlewareClient2 = _interopRequireDefault(_MiddlewareClient);

var _MiddlewareAbstract = require("./MiddlewareAbstract");

var _MiddlewareAbstract2 = _interopRequireDefault(_MiddlewareAbstract);

var _actionsDisksActionCreators = require("../actions/DisksActionCreators");

var _actionsDisksActionCreators2 = _interopRequireDefault(_actionsDisksActionCreators);

var DisksMiddleware = (function (_AbstractBase) {
  function DisksMiddleware() {
    _classCallCheck(this, DisksMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(DisksMiddleware, _AbstractBase);

  _createClass(DisksMiddleware, null, [{
    key: "subscribe",
    value: function subscribe(componentID) {
      _MiddlewareClient2["default"].subscribe(["entity-subscriber.disks.changed"], componentID);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(componentID) {
      _MiddlewareClient2["default"].unsubscribe(["entity-subscriber.disks.changed"], componentID);
    }
  }, {
    key: "requestDisksOverview",
    value: function requestDisksOverview() {
      _MiddlewareClient2["default"].request("disks.query", [], function resolveDisksOverview(rawDisksOverview) {
        _actionsDisksActionCreators2["default"].receiveDisksOverview(rawDisksOverview);
      });
    }
  }, {
    key: "requestDiskDetails",
    value: function requestDiskDetails(diskPath) {
      if (_lodash2["default"].isString(diskPath)) {
        _MiddlewareClient2["default"].request("disks.get_disk_config", [diskPath], function resolveDiskDetails(rawDiskDetails) {
          _actionsDisksActionCreators2["default"].receiveDiskDetails(rawDiskDetails);
        });
      } else {
        throw new Error("The argument for DisksMiddleware.requestDiskDetails " + "must be a string representing a disk's path.");
        return;
      }
    }
  }]);

  return DisksMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = DisksMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=DisksMiddleware.js.map