// Zfs Flux Store
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

var _zfsPoolData = {};
var _zfsBootPoolData = {};
var _zfsPoolGetDisksData = {};

var ZfsStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

  emitChange: function emitChange(changeType) {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getZfsPool: function getZfsPool(name) {
    return _zfsPoolData[name];
  },
  getZfsBootPool: function getZfsBootPool(name) {
    return _zfsBootPoolData[name];
  },
  getZfsPoolGetDisks: function getZfsPoolGetDisks(name) {
    return _zfsPoolGetDisksData[name];
  }

});

ZfsStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_ZFS_POOL_DATA:
      _zfsPoolData[action.zfsPoolName] = action.zfsPool;
      ZfsStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_ZFS_BOOT_POOL_DATA:
      _zfsBootPoolData[action.zfsBootPoolArgument] = action.zfsBootPool;
      ZfsStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_ZFS_POOL_GET_DISKS_DATA:
      _zfsPoolGetDisksData[action.zfsPoolGetDisksArgument] = action.zfsPoolGetDisks;
      ZfsStore.emitChange();
      break;

    default:
    // No action
  }
});

module.exports = ZfsStore;
//# sourceMappingURL=ZfsStore.js.map
