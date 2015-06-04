// Services Action Creators
// ==================================

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var ServicesActionCreators = (function () {
  function ServicesActionCreators() {
    _classCallCheck(this, ServicesActionCreators);
  }

  _createClass(ServicesActionCreators, null, [{
    key: "receiveServicesList",
    value: function receiveServicesList(rawServices) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.RECEIVE_RAW_SERVICES,
        rawServices: rawServices
      });
    }
  }, {
    key: "receiveServiceUpdateTask",
    value: function receiveServiceUpdateTask(taskID, serviceName) {
      _dispatcherFreeNASDispatcher2["default"].handleClientAction({ type: _constantsFreeNASConstants.ActionTypes.RECEIVE_SERVICE_UPDATE_TASK,
        taskID: taskID,
        serviceName: serviceName
      });
    }
  }]);

  return ServicesActionCreators;
})();

;

exports["default"] = ServicesActionCreators;
module.exports = exports["default"];
//# sourceMappingURL=ServicesActionCreators.js.map