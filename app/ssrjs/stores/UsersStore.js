// Users Flux Store
// ----------------

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var _middlewareUsersMiddleware = require("../middleware/UsersMiddleware");

var _middlewareUsersMiddleware2 = _interopRequireDefault(_middlewareUsersMiddleware);

var CHANGE_EVENT = "change";
var UPDATE_MASK = "users.changed";
var PRIMARY_KEY = "id";

var _updatedOnServer = [];
var _localUpdatePending = {};
var _users = {};

var UsersStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

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

  isUserUpdatePending: function isUserUpdatePending(id) {
    return _updatedOnServer.indexOf(id) > -1;
  },

  findUserByKeyValue: function findUserByKeyValue(key, value) {
    var predicate = {};
    predicate[key] = value;

    return _lodash2["default"].find(_users, predicate);
  },

  getUser: function getUser(id) {
    return _users[id];
  },

  getAllUsers: function getAllUsers() {
    return _lodash2["default"].values(_users);
  }

  // Returns an array of the complete objects for each user in
  // the requested group.
  , getUsersByGroup: function getUsersByGroup(groupID) {
    var groupUsers = _lodash2["default"].filter(_users, function (currentUser) {
      if (_lodash2["default"].includes(currentUser.groups, groupID) || currentUser.group === groupID) {
        return true;
      } else {
        return false;
      }
    });
    return groupUsers;
  }

});

UsersStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_RAW_USERS:

      var updatedUserIDs = _lodash2["default"].pluck(action.rawUsers, PRIMARY_KEY);

      // When receiving new data, we can comfortably resolve anything that may
      // have had an outstanding update indicated by the Middleware.
      if (_updatedOnServer.length > 0) {
        _updatedOnServer = _lodash2["default"].difference(_updatedOnServer, updatedUserIDs);
      }

      action.rawUsers.map(function (user) {
        _users[user[PRIMARY_KEY]] = user;
      });

      UsersStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:
      var args = action.eventData.args;
      var updateData = args["args"];

      // FIXME: This is a workaround for the current implementation of task
      // subscriptions and submission resolutions.
      if (args["name"] === UPDATE_MASK) {
        if (updateData["operation"] === "delete") {
          // FIXME: Will this cause an issue if the delete is unsuccessful?
          // This will no doubt be overriden in the new patch-based world anyway.
          _users = _lodash2["default"].omit(_users, updateData["ids"]);
        } else if (updateData["operation"] === "update" || updateData["operation"] === "create") {
          Array.prototype.push.apply(_updatedOnServer, updateData["ids"]);
          _middlewareUsersMiddleware2["default"].requestUsersList(_updatedOnServer);
        } else {}
        UsersStore.emitChange();

        // TODO: Make this more generic, triage it earlier, create ActionTypes for it
      } else if (args["name"] === "task.updated" && args.args["state"] === "FINISHED") {
        delete _localUpdatePending[args.args["id"]];
      }

      break;

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_USER_UPDATE_TASK:
      _localUpdatePending[action.taskID] = action.userID;
      UsersStore.emitChange();
      break;

    default:
    // No action
  }
});

module.exports = UsersStore;

// TODO: Are there any other cases?
//# sourceMappingURL=UsersStore.js.map