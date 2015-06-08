// Update Data Flux Store
// ----------------

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var CHANGE_EVENT = "change";

var _updateData = {};

var UpdateStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

  emitChange: function emitChange(changeType) {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getUpdate: function getUpdate(name) {
    return _updateData[name];
  }

});

UpdateStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_UPDATE_DATA:
      _updateData[action.updateInfoName] = action.updateInfo;
      UpdateStore.emitChange();
      break;

    default:
    // No action
  }
});

module.exports = UpdateStore;
//# sourceMappingURL=UpdateStore.js.map
