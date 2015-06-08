// Middleware Action Creators
// ==================================
// Handle high level Middleware events and actions, handle lifecycle and
// authentication changes, and call the dispatcher

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

var MiddleWareActionCreators = (function () {
  function MiddleWareActionCreators() {
    _classCallCheck(this, MiddleWareActionCreators);
  }

  _createClass(MiddleWareActionCreators, null, [{
    key: "receiveAuthenticationChange",
    value: function receiveAuthenticationChange(currentUser, loggedIn) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.UPDATE_AUTH_STATE,
        currentUser: currentUser,
        loggedIn: loggedIn
      });
    }
  }, {
    key: "updateSocketState",
    value: function updateSocketState(sockState) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.UPDATE_SOCKET_STATE,
        sockState: sockState
      });
    }
  }, {
    key: "updateReconnectTime",
    value: function updateReconnectTime(ETA) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.UPDATE_RECONNECT_TIME,
        ETA: ETA
      });
    }
  }, {
    key: "increaseSubscriptionCount",
    value: function increaseSubscriptionCount(mask) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.SUBSCRIBE_TO_MASK,
        mask: mask
      });
    }
  }, {
    key: "decreaseSubscriptionCount",
    value: function decreaseSubscriptionCount(mask) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.UNSUBSCRIBE_FROM_MASK,
        mask: mask
      });
    }
  }, {
    key: "receiveEventData",
    value: function receiveEventData(eventData) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT,
        eventData: eventData
      });
    }
  }, {
    key: "receiveAvailableServices",
    value: function receiveAvailableServices(services) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.RECEIVE_RPC_SERVICES,
        services: services
      });
    }
  }, {
    key: "receiveAvailableServiceMethods",
    value: function receiveAvailableServiceMethods(service, methods) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.RECEIVE_RPC_SERVICE_METHODS,
        service: service,
        methods: methods
      });
    }
  }]);

  return MiddleWareActionCreators;
})();

;

exports["default"] = MiddleWareActionCreators;
module.exports = exports["default"];
//# sourceMappingURL=MiddlewareActionCreators.js.map
