// Widget Data Flux Store
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

var _widgetData = {};
var _dataUpdate = [];

var StatdStore = _lodash2["default"].assign({}, _events.EventEmitter.prototype, {

  emitChange: function emitChange(changeType) {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getWidgetData: function getWidgetData(name) {
    return _widgetData[name];
  },

  getWidgetDataUpdate: function getWidgetDataUpdate() {
    return _dataUpdate;
  }

});

StatdStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_RAW_WIDGET_DATA:
      if (action.rawWidgetData.data !== undefined) {
        _widgetData[action.dataSourceName] = action.rawWidgetData.data;
      } else {
        _widgetData[action.dataSourceName] = { error: true, msg: action.rawWidgetData.message };
      }
      StatdStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:
      if (action.eventData.args && _lodash2["default"].startsWith(action.eventData.args["name"], "statd.")) {
        _dataUpdate = action.eventData.args;
        StatdStore.emitChange();
      }
      break;

    default:
    // No action
  }
});

module.exports = StatdStore;
//# sourceMappingURL=StatdStore.js.map