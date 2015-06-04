// Session Flux Store
// ==================
// Stores the user's credentials for GUI use. Not the source of truth.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var CHANGE_EVENT = "change";

var _currentUser = "";
var _loggedIn = false;

var SessionStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

  emitChange: function emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCurrentUser: function getCurrentUser() {
    return _currentUser;
  },

  getLoginStatus: function getLoginStatus() {
    return _loggedIn;
  }

});

SessionStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.UPDATE_AUTH_STATE:
      _currentUser = action.currentUser;
      _loggedIn = action.loggedIn;
      SessionStore.emitChange();
      break;

    default:
    //No action

  }
});

module.exports = SessionStore;
//# sourceMappingURL=SessionStore.js.map