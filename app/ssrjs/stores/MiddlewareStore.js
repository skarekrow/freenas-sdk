// Middleware Flux Store
// =====================
// Maintain consistent information about the general state of the middleware
// client, including which channels are connected, pending calls, and blocked operations.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events2 = require("events");

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var CHANGE_EVENT = "change";

var _rpcServices = [];
var _rpcMethods = {};
var _events = [];
var socketConnected = false;
var reconnectETA = 0;

var MiddlewareStore = _lodash2["default"].assign({}, _events2.EventEmitter.prototype, {

  emitChange: function emitChange(namespace) {
    this.emit(CHANGE_EVENT, namespace);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  // RPC
  , getAvailableRPCServices: function getAvailableRPCServices() {
    return _rpcServices;
  },

  getAvailableRPCMethods: function getAvailableRPCMethods() {
    return _rpcMethods;
  }

  // hook to get socket state and time to reconnect if not connected
  , getSockState: function getSockState() {
    return [socketConnected, reconnectETA];
  }

  // EVENTS
  , getEventLog: function getEventLog() {
    return _events;
  }

});

MiddlewareStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.UPDATE_SOCKET_STATE:
      if (action.sockState === "connected") {
        socketConnected = true;
      } else if (action.sockState === "disconnected") {
        socketConnected = false;
      }
      MiddlewareStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.UPDATE_RECONNECT_TIME:
      reconnectETA = action.ETA;
      MiddlewareStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:

      // Prepend latest event to the front of the array
      _events.unshift(action.eventData);
      MiddlewareStore.emitChange("events");

      break;

    case _constantsFreeNASConstants.ActionTypes.LOG_MIDDLEWARE_TASK_QUEUE:

      // TODO: handle task queue

      MiddlewareStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_RPC_SERVICES:
      _rpcServices = action.services;

      MiddlewareStore.emitChange("services");
      break;

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_RPC_SERVICE_METHODS:
      _rpcMethods[action.service] = action.methods;

      MiddlewareStore.emitChange("methods");
      break;

    default:
    // No action
  }
});

module.exports = MiddlewareStore;
//# sourceMappingURL=MiddlewareStore.js.map
