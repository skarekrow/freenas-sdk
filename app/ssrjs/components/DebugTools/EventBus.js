// DEBUG TOOLS EVENT BUS
// =====================
// Small event bus to assist with showing and hiding the Debug Tools pane.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var EventBus = _lodash2["default"].assign({}, _events.EventEmitter.prototype, { emitToggle: function emitToggle() {
    this.emit("toggle");
  },

  addListener: function addListener(callback) {
    this.on("toggle", callback);
  },

  removeListener: function removeListener(callback) {
    this.removeListener("toggle", callback);
  }

});

exports["default"] = EventBus;
module.exports = exports["default"];
//# sourceMappingURL=EventBus.js.map
