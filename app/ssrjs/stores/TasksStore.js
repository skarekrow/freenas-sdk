// Tasks Flux Store
// ================
// Maintain log of tasks, and their respective status.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var CHANGE_EVENT = "change";

var _created = {};
var _waiting = {};
var _executing = {};
var _finished = {};
var _failed = {};
var _aborted = {};

var TasksStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

  emitChange: function emitChange(namespace) {
    this.emit(CHANGE_EVENT, namespace);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAllTasks: function getAllTasks() {
    return {
      CREATED: _created,
      WAITING: _waiting,
      EXECUTING: _executing,
      FINISHED: _finished,
      FAILED: _failed,
      ABORTED: _aborted
    };
  },

  getCreatedTasks: function getCreatedTasks() {
    return _created;
  },

  getWaitingTasks: function getWaitingTasks() {
    return _waiting;
  },

  getExecutingTasks: function getExecutingTasks() {
    return _executing;
  },

  getFinishedTasks: function getFinishedTasks() {
    return _finished;
  },

  getFailedTasks: function getFailedTasks() {
    return _failed;
  },

  getAbortedTasks: function getAbortedTasks() {
    return _aborted;
  }
});

TasksStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {

  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:
      if (action.eventData.args["name"].indexOf("task.") !== -1) {
        var taskArgs = action.eventData.args.args;

        var CREATED = _created[taskArgs["id"]] || {};
        var WAITING = _waiting[taskArgs["id"]] || {};
        var EXECUTING = _executing[taskArgs["id"]] || {};

        switch (action.eventData.args["name"]) {
          case "task.created":
            _created[taskArgs["id"]] = taskArgs;
            break;

          case "task.updated":
            switch (taskArgs["state"]) {

              case "WAITING":
                _waiting[taskArgs["id"]] = _lodash2["default"].merge(CREATED, taskArgs);

                delete _created[taskArgs["id"]];
                break;

              case "EXECUTING":
                _executing[taskArgs["id"]] = _lodash2["default"].merge(CREATED, WAITING, taskArgs);

                delete _created[taskArgs["id"]];
                delete _waiting[taskArgs["id"]];
                break;

              case "FINISHED":
                _finished[taskArgs["id"]] = _lodash2["default"].merge(CREATED, WAITING, EXECUTING, taskArgs, { "percentage": 100 });

                delete _created[taskArgs["id"]];
                delete _waiting[taskArgs["id"]];
                delete _executing[taskArgs["id"]];
                break;

              case "ABORTED":
                _aborted[taskArgs["id"]] = _lodash2["default"].merge(CREATED, WAITING, EXECUTING, taskArgs, { "percentage": taskArgs["percentage"] });
                delete _created[taskArgs["id"]];
                delete _waiting[taskArgs["id"]];
                delete _executing[taskArgs["id"]];
                break;

              case "FAILED":
                _failed[taskArgs["id"]] = _lodash2["default"].merge(CREATED, WAITING, EXECUTING, taskArgs, { "percentage": taskArgs["percentage"] });
                delete _created[taskArgs["id"]];
                delete _waiting[taskArgs["id"]];
                delete _executing[taskArgs["id"]];
                break;
            }

            break;

          case "task.progress":
            switch (taskArgs["state"]) {
              case "WAITING":
                _waiting[taskArgs["id"]] = _lodash2["default"].merge(WAITING, taskArgs);
                break;

              case "EXECUTING":
                _executing[taskArgs["id"]] = _lodash2["default"].merge(EXECUTING, taskArgs);
                break;
            }

            break;
        }

        TasksStore.emitChange();
      }
      break;

    default:
    // No action
  }
});

module.exports = TasksStore;
//# sourceMappingURL=TasksStore.js.map
