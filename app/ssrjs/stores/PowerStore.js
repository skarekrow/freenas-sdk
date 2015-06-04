// Power Flux Store
// ----------------
// This is suraj's experimental setup might change or go away completely

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var CHANGE_EVENT = "change";
var UPDATE_MASK = ["power.changed", "update.changed"];

var ongoingEvents = {};

var PowerStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

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

  isEventPending: function isEventPending() {
    if (typeof _lodash2["default"].keys(ongoingEvents)[0] !== "undefined") {
      return [true, ongoingEvents[_lodash2["default"].keys(ongoingEvents)[0]]];
    }
    return [false, ""];
  },

  isRebootPending: function isRebootPending() {
    if (_lodash2["default"].values(ongoingEvents).indexOf("reboot") !== -1) {
      return true;
    }
    return false;
  },

  isShutDownPending: function isShutDownPending() {
    if (_lodash2["default"].values(ongoingEvents).indexOf("shutdown") !== -1) {
      return true;
    }
    return false;
  },

  isUpdatePending: function isUpdatePending() {
    if (_lodash2["default"].values(ongoingEvents).indexOf("update") !== -1) {
      return true;
    }
    return false;
  }

});

PowerStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.UPDATE_SOCKET_STATE:
      // clear ongoingEvents
      ongoingEvents = {};
      PowerStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:
      var args = action.eventData.args;
      var taskID = args.args["id"];

      if (UPDATE_MASK.indexOf(args["name"]) !== -1) {
        var updateData = args["args"];

        if (args["name"] === "power.changed") {
          ongoingEvents[taskID] = updateData["operation"];
        } else if (args["name"] === "update.changed" && updateData["operation"] === "started") {
          ongoingEvents[taskID] = "update";
        }

        PowerStore.emitChange();

        // TODO: Make this more generic, triage it earlier,
        // create ActionTypes for it
      } else if (args["name"] === "task.updated" && args.args["state"] === "FINISHED" && _lodash2["default"].keys(ongoingEvents).indexOf(taskID) !== -1) {
        if (ongoingEvents[taskID] !== "shutdown" || ongoingEvents[taskID] !== "reboot") {
          delete ongoingEvents.taskID;
        }
        PowerStore.emitChange();
      }

      break;

    default:
    // No action
  }
});

module.exports = PowerStore;
//# sourceMappingURL=PowerStore.js.map