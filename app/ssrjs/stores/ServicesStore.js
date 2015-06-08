// Services Flux Store
// ----------------

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var _middlewareServicesMiddleware = require("../middleware/ServicesMiddleware");

var _middlewareServicesMiddleware2 = _interopRequireDefault(_middlewareServicesMiddleware);

var CHANGE_EVENT = "change";

var _services = [];
var _scheduledForStateUpdate = {};
var ServicesStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

  emitChange: function emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  findServiceByKeyValue: function findServiceByKeyValue(key, value) {
    var predicate = {};
    predicate[key] = value;

    return _lodash2["default"].find(_services, predicate);
  },

  getAllServices: function getAllServices() {
    return _services;
  }

});

ServicesStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_RAW_SERVICES:
      _services = action.rawServices;
      ServicesStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_SERVICE_UPDATE_TASK:
      _scheduledForStateUpdate[action.taskID] = action.serviceName;
      ServicesStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:
      if (_scheduledForStateUpdate[action.eventData.args.args.id] && (action.eventData.args.args.state === "FINISHED" || action.eventData.args.args.state === "FAILED")) {
        // We have final result lets get the new set of services and
        // clean this task id from _scheduledForStateUpdate
        _middlewareServicesMiddleware2["default"].requestServicesList();
        _lodash2["default"].remove(_scheduledForStateUpdate, action.eventData.args.args.id);
      }
      break;

    default:
    // No action
  }
});

module.exports = ServicesStore;
//# sourceMappingURL=ServicesStore.js.map
