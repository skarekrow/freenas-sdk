// FreeNAS Dispatcher
// ------------------
// Flux dispatcher used throughout the FreeNAS webapp. Manages all data flow,
// updates data stores with new data from user interaction or from the
// middleware.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _flux = require("flux");

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var dispatchQueue;
var FreeNASDispatcher;

// WARNING: This is a dangerous way of handling dispatches. Because of the
// way the FreeNAS webapp handles subscriptions, nested routes, and component
// heirarchy, it's possible for one dispatch to indirectly trigger another as
// part of the same call stack. Enqueueing dispatches in this way causes all
// dispatches to wait for the previous call stack to finish, but may
// inadvertently allow cascading or endless dispatches. Be careful.

// See also: https://github.com/facebook/flux/issues/106

dispatchQueue = _async2["default"].queue(function (payload, callback) {
  FreeNASDispatcher.dispatch(payload);

  if (_lodash2["default"].isFunction(callback)) {
    callback();
  }
});

FreeNASDispatcher = _lodash2["default"].assign(new _flux.Dispatcher(), {

  handleMiddlewareAction: function handleMiddlewareAction(action) {
    dispatchQueue.push({
      source: _constantsFreeNASConstants.PayloadSources["MIDDLEWARE_ACTION"],
      action: action
    });
  },

  handleMiddlewareLifecycle: function handleMiddlewareLifecycle(action) {
    dispatchQueue.push({
      source: _constantsFreeNASConstants.PayloadSources["MIDDLEWARE_LIFECYCLE"],
      action: action
    });
  },

  handleClientAction: function handleClientAction(action) {
    dispatchQueue.push({
      source: _constantsFreeNASConstants.PayloadSources["CLIENT_ACTION"],
      action: action
    });
  }

});

module.exports = FreeNASDispatcher;
//# sourceMappingURL=FreeNASDispatcher.js.map