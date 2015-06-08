// Subscriptions Action Creators
// ==================================
// Handle recording and removing subscription data, as well as information about
// the views that are subscribing.

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

var SubscriptionsActionCreators = (function () {
  function SubscriptionsActionCreators() {
    _classCallCheck(this, SubscriptionsActionCreators);
  }

  _createClass(SubscriptionsActionCreators, null, [{
    key: "recordNewSubscriptions",
    value: function recordNewSubscriptions(masks, componentID) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.SUBSCRIBE_COMPONENT_TO_MASKS,
        masks: masks,
        componentID: componentID
      });
    }
  }, {
    key: "deleteCurrentSubscriptions",
    value: function deleteCurrentSubscriptions(masks, componentID) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.UNSUBSCRIBE_COMPONENT_FROM_MASKS,
        masks: masks,
        componentID: componentID
      });
    }
  }, {
    key: "deleteAllSubscriptions",
    value: function deleteAllSubscriptions() {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.UNSUBSCRIBE_ALL
      });
    }
  }]);

  return SubscriptionsActionCreators;
})();

;

exports["default"] = SubscriptionsActionCreators;
module.exports = exports["default"];
//# sourceMappingURL=SubscriptionsActionCreators.js.map
