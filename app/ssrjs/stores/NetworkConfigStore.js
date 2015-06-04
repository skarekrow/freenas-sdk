// Network Config Flux Store
// =========================

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var _middlewareGroupsMiddleware = require("../middleware/GroupsMiddleware");

var _middlewareGroupsMiddleware2 = _interopRequireDefault(_middlewareGroupsMiddleware);

var CHANGE_EVENT = "change";
var UPDATE_MASK = "network.changed";

var _localUpdatePending = false;
var _networkConfig = {};

var NetworkConfigStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

  emitChange: function emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getUpdateMask: function getUpdateMask() {
    return UPDATE_MASK;
  },

  isLocalUpdatePending: function isLocalUpdatePending() {
    return _localUpdatePending;
  },

  getNetworkConfig: function getNetworkConfig() {
    return _networkConfig;
  }

});

NetworkConfigStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_NETWORK_CONFIG:

      _networkConfig = action.networkConfig;
      NetworkConfigStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:

      var args = action.eventData.args;
      var updateData = args.args;

      // The second check here should never fail, but I'm putting it
      // here out of an overabundance of caution.
      var validUpdate = args["name"] === UPDATE_MASK && updateData["operation"] === "update";

      if (validUpdate) {
        _localUpdatePending = false;
        NetworkConfigStore.emitChange();
      }

      break;

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_NETWORK_UPDATE_TASK:

      _localUpdatePending = true;
      NetworkConfigStore.emitChange();
      break;
  }
});

module.exports = NetworkConfigStore;
//# sourceMappingURL=NetworkConfigStore.js.map