// Middleware Flux Store
// =====================
// Maintain consistent information about the general state of the middleware
// client, including which channels are connected, pending calls, and blocked operations.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var CHANGE_EVENT = "change";

var _subscribed = {};

// SCHEMA
// _subscribed = {
//     "foo.bar": {
//         MyReactComponent : 2
//       , SchmoopyPoo      : 1
//     }
//   , "doop.zoop": {
//         BusyBox : 1
//     }
// }

// <subscriptions>
//   <namespaces>
//     <component names> : <subscribed instances>

var SubscriptionsStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

  emitChange: function emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  // SUBSCRIPTIONS
  , getAllSubscriptions: function getAllSubscriptions() {
    return _subscribed;
  },

  getSubscriptionsByMask: function getSubscriptionsByMask(mask) {
    return _subscribed[mask];
  },

  getNumberOfSubscriptionsForMask: function getNumberOfSubscriptionsForMask(mask) {
    var numberSubscribed = 0;

    if (_lodash2["default"].isObject(_subscribed[mask])) {
      _lodash2["default"].forEach(_subscribed[mask], function (subscribedData) {
        if (typeof subscribedData === "number") {
          numberSubscribed += subscribedData;
        }
      });
      return numberSubscribed;
    } else {
      return 0;
    }
  }

});

SubscriptionsStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;
  var newSubscriptions = {};

  switch (action.type) {

    // Subscriptions
    case _constantsFreeNASConstants.ActionTypes.SUBSCRIBE_COMPONENT_TO_MASKS:
      newSubscriptions = _lodash2["default"].cloneDeep(_subscribed);

      _lodash2["default"].forEach(action.masks, function (mask) {
        if (_lodash2["default"].isObject(newSubscriptions[mask])) {
          if (_lodash2["default"].isNumber(newSubscriptions[mask][action.componentID])) {
            newSubscriptions[mask][action.componentID]++;
          } else {
            newSubscriptions[mask][action.componentID] = 1;
          }
        } else {
          newSubscriptions[mask] = {};
          newSubscriptions[mask][action.componentID] = 1;
        }
      });

      _subscribed = newSubscriptions;

      SubscriptionsStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.UNSUBSCRIBE_COMPONENT_FROM_MASKS:
      newSubscriptions = _lodash2["default"].cloneDeep(_subscribed);

      _lodash2["default"].forEach(action.masks, function (mask) {
        if (_lodash2["default"].isObject(newSubscriptions[mask])) {
          if (newSubscriptions[mask][action.componentID] <= 1) {
            delete newSubscriptions[mask][action.componentID];
          } else {
            newSubscriptions[mask][action.componentID]--;
          }
        } else {
          console.warn("Tried to unsubscribe from '" + mask + "', but Flux store shows no active subscriptions.");
        }

        if (_lodash2["default"].isEmpty(newSubscriptions[mask])) {
          delete newSubscriptions[mask];
        }
      });

      _subscribed = newSubscriptions;

      SubscriptionsStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.UNSUBSCRIBE_ALL:
      // TODO: Should this be the default?
      _subscribed = newSubscriptions;
      SubscriptionsStore.emitChange();
      break;

    default:
    // No action
  }
});

module.exports = SubscriptionsStore;
//# sourceMappingURL=SubscriptionsStore.js.map
