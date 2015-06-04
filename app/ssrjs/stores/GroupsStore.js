// Groups Flux Store
// -----------------

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
var UPDATE_MASK = "groups.changed";
var PRIMARY_KEY = "id";

var _localUpdatePending = {};
var _updatedOnServer = [];
var _groups = {};

var GroupsStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

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

  getPendingUpdateIDs: function getPendingUpdateIDs() {
    return _updatedOnServer;
  },

  isLocalTaskPending: function isLocalTaskPending(id) {
    return _lodash2["default"].values(_localUpdatePending).indexOf(id) > -1;
  },

  isGroupUpdatePending: function isGroupUpdatePending(id) {
    return _updatedOnServer.indexOf(id) > -1;
  },

  findGroupByKeyValue: function findGroupByKeyValue(key, value) {
    return _lodash2["default"].find(_groups, function (group) {
      return group[key] === value;
    });
  },

  getGroup: function getGroup(id) {
    return _groups[id];
  },

  getAllGroups: function getAllGroups() {
    return _lodash2["default"].values(_groups);
  }

});

GroupsStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_GROUPS_LIST:

      var updatedGroupIDs = _lodash2["default"].pluck(action.groupsList, PRIMARY_KEY);

      // When receiving new data, we can comfortably resolve anything that may
      // have had an outstanding update indicated by the Middleware.
      if (_updatedOnServer.length > 0) {
        _updatedOnServer = _lodash2["default"].difference(_updatedOnServer, updatedGroupIDs);
      }

      // Updated groups come from the middleware as an array, but we store the
      // data as an object keyed by the PRIMARY_KEY. Here, we map the changed
      // groups into the object.
      action.groupsList.map(function (group) {
        _groups[group[PRIMARY_KEY]] = group;
      });
      GroupsStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:
      var args = action.eventData.args;
      var updateData = args["args"];

      if (args["name"] === UPDATE_MASK) {
        if (updateData["operation"] === "delete") {
          _groups = _lodash2["default"].omit(_groups, updateData["ids"]);
        } else if (updateData["operation"] === "create" || updateData["operation"] === "update") {
          Array.prototype.push.apply(_updatedOnServer, updateData["ids"]);
          _middlewareGroupsMiddleware2["default"].requestGroupsList(_updatedOnServer);
        }
        GroupsStore.emitChange();
      } else if (args["name"] === "task.updated" && updateData["state"] === "FINISHED") {
        delete _localUpdatePending[updateData["id"]];
      }
      break;

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_GROUP_UPDATE_TASK:
      _localUpdatePending[action.taskID] = action.groupID;
      GroupsStore.emitChange();
      break;

    default:
    // Do Nothing
  }
});

module.exports = GroupsStore;
//# sourceMappingURL=GroupsStore.js.map