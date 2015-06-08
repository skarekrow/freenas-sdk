// DEBUG LOGGER
// ============
// A helper class with simple methods for logging debug output to the console.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _slice = Array.prototype.slice;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var DEBUGCSS = { uuid: "color: rgb(33, 114, 218);",
  args: "color: rgb(215, 110, 20); font-style: italic;",
  error: "color: rgb(235, 15, 15);",
  code: "color: rgb(62, 28, 86);",
  normal: ""
};

var DebugLogger = (function () {
  function DebugLogger(namespace, defaultType) {
    _classCallCheck(this, DebugLogger);

    this.namespace = namespace || null;
    this.defaultType = defaultType || "log";
    this.DEBUGCSS = DEBUGCSS;
  }

  _createClass(DebugLogger, [{
    key: "reports",
    value: function reports(flag) {
      if (typeof window && window.DEBUG_FLAGS) {
        if (this.namespace && window.DEBUG_FLAGS[this.namespace]) {
          return Boolean(window.DEBUG_FLAGS[this.namespace][flag]);
        } else {
          return Boolean(window.DEBUG_FLAGS[flag]);
        }
      }

      return false;
    }
  }, {
    key: "formatOutput",
    value: function formatOutput(contents, css) {
      var _this = this;

      var output = [];

      if (contents && contents.length) {
        if (_lodash2["default"].isArray(contents)) {

          output = output.concat(contents);
        } else if (_lodash2["default"].isString(contents)) {

          output.push(contents);
        }
      }

      if (css && css.length) {
        if (_lodash2["default"].isArray(css) && css.length) {

          output = output.concat(css.map(function (style) {
            return _this.DEBUGCSS[style];
          }));
        } else if (_lodash2["default"].isString(css) && this.DEBUGCSS[css]) {

          output.push(this.DEBUGCSS[css]);
        }
      }

      return output;
    }
  }, {
    key: "write",
    value: function write(type, contents, css) {
      if (contents) {
        switch (type) {
          case "dir":
          case "error":
          case "info":
          case "log":
          case "table":
          case "trace":
          case "warn":
            console[type].apply(console, _toConsumableArray(this.formatOutput(contents, css)));
            break;

          default:
            console.log.apply(console, _toConsumableArray(this.formatOutput(contents, css)));
            break;
        }
      }
    }
  }, {
    key: "dir",

    // Shortcut methods aliasing write(). Reduces clutter in calls.
    value: function dir() {
      this.write.apply(this, ["dir"].concat(_slice.call(arguments)));
    }
  }, {
    key: "error",
    value: function error() {
      this.write.apply(this, ["error"].concat(_slice.call(arguments)));
    }
  }, {
    key: "info",
    value: function info() {
      this.write.apply(this, ["info"].concat(_slice.call(arguments)));
    }
  }, {
    key: "log",
    value: function log() {
      this.write.apply(this, ["log"].concat(_slice.call(arguments)));
    }
  }, {
    key: "table",
    value: function table() {
      this.write.apply(this, ["table"].concat(_slice.call(arguments)));
    }
  }, {
    key: "trace",
    value: function trace() {
      this.write.apply(this, ["trace"].concat(_slice.call(arguments)));
    }
  }, {
    key: "warn",
    value: function warn() {
      this.write.apply(this, ["warn"].concat(_slice.call(arguments)));
    }
  }, {
    key: "group",
    value: function group(type, flag, heading, contents, css) {}
  }]);

  return DebugLogger;
})();

;

exports["default"] = DebugLogger;
module.exports = exports["default"];
//# sourceMappingURL=DebugLogger.js.map
