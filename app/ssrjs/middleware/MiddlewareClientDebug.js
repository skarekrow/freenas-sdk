// MIDDLEWARE CLIENT DEBUG
// =======================
// Companion class for Middleware Client. Abstracts out some of the more
// cumbersome debug methods to keep process flow simple and obvious in the
// Middleware Client.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _commonDebugLogger = require("../common/DebugLogger");

var _commonDebugLogger2 = _interopRequireDefault(_commonDebugLogger);

var MiddlewareClientDebug = (function (_DebugLogger) {
  function MiddlewareClientDebug() {
    _classCallCheck(this, MiddlewareClientDebug);

    _get(Object.getPrototypeOf(MiddlewareClientDebug.prototype), "constructor", this).call(this, "MIDDLEWARE_CLIENT_DEBUG");
  }

  _inherits(MiddlewareClientDebug, _DebugLogger);

  _createClass(MiddlewareClientDebug, [{
    key: "logPack",
    value: function logPack(namespace, name, args, id) {
      var validPack = true;
      var prefix = "BAD PACK: ";

      if (!_lodash2["default"].isString(namespace)) {
        validPack = false;
        this.warn("packing", prefix + "Provided namespace was not a string for request " + ("%c'" + id + "'%c"), [this.DEBUGCSS.uuid, this.DEBUGCSS.normal]);
      }
      if (!_lodash2["default"].isString(name)) {
        validPack = false;
        this.warn("packing", prefix + ("Provided name was not a string for request %c'" + id + "'%c"), [this.DEBUGCSS.uuid, this.DEBUGCSS.normal]);
      }
      if (typeof args === ("null" || "undefined")) {
        validPack = false;
        this.warn("packing", prefix + "Provided args value was null or undefined for request " + ("%c'" + id + "'%c"), [this.DEBUGCSS.uuid, this.DEBUGCSS.normal]);
      }
      if (!_lodash2["default"].isString(id)) {
        validPack = false;
        var packArgs = args ? ":" + args : "";

        this.warn("packing", prefix + ("UUID %c'" + id + "'%c for '" + namespace + "'" + packArgs + " had ") + "to be generated because none was provided%c", [this.DEBUGCSS.uuid, this.DEBUGCSS.normal]);
      }

      if (validPack) {
        this.info("Packed request %c'" + id + "'%c successfully.", [this.DEBUGCSS.uuid, this.DEBUGCSS.normal]);
      } else {
        this.log(["Dump of bad pack:", { namespace: namespace,
          name: name,
          id: id,
          args: args
        }]);
      }
    }
  }, {
    key: "logNewSubscriptionMasks",
    value: function logNewSubscriptionMasks(masks) {
      var logMasks = masks.length > 1 ? _lodash2["default"].clone(masks).splice(masks.length - 1, 0, " and ").join(", ") : masks;

      this.log("Requested: Subscribe to %c'" + logMasks + "'%c events", ["args", "normal"]);
    }
  }, {
    key: "logSubscription",
    value: function logSubscription(subCount, mask) {
      if (subCount > 0) {
        this.info("" + subCount + " React components are currently " + ("subscribed to %c'" + mask + "'%c events"), ["args", "normal"]);
        this.log("Increasing subscription count for %c'" + mask + "'", "args");
      } else {
        this.info("No React components are currently subscribed to " + ("%c'" + mask + "'%c events"), ["args", "normal"]);
        this.log("Sending subscription request, and setting subscription " + ("count for %c'" + mask + "'%c to 1"), ["args", "normal"]);
      }
    }
  }, {
    key: "logUnsubscribeMasks",
    value: function logUnsubscribeMasks(masks) {
      var logMasks = masks.length > 1 ? _lodash2["default"].clone(masks).splice(masks.length - 1, 0, " and ").join(", ") : masks;

      this.log("Requested: Subscribe to %c'" + logMasks + "'%c events", ["args", "normal"]);
    }
  }, {
    key: "logUnsubscribe",
    value: function logUnsubscribe(subCount, mask) {
      if (subCount === 1) {
        this.info("Only one React component is currently subscribed to " + ("%c'" + mask + "'%c events, so the subscription will be removed"), ["args", "normal"]);
        this.log("Sending unsubscribe request, and deleting subscription " + ("count entry for %c'" + mask + "'"), "args");
      } else {
        this.info("" + subCount + " React components are currently subscribed " + ("to %c'" + mask + "'%c events, and one will be unsubscribed"), ["args", "normal"]);
        this.log("Decreasing subscription count for %c'" + mask + "'", "args");
      }
    }
  }, {
    key: "logPythonTraceback",
    value: function logPythonTraceback(requestID, args, originalRequest) {
      console.groupCollapsed("%cRequest %c'" + requestID + "'%c caused a Python traceback", this.DEBUGCSS.error, this.DEBUGCSS.uuid, this.DEBUGCSS.error);
      if (originalRequest) {
        console.groupCollapsed("Original request");
        console.log(originalRequest);
        console.groupEnd();
      }
      console.groupCollapsed("Response data");
      console.log(args);
      console.groupEnd();
      console.log("%c" + args.message, this.DEBUGCSS.code);
      console.groupEnd();
    }
  }, {
    key: "logErrorWithCode",
    value: function logErrorWithCode(requestID, args, originalRequest) {
      console.groupCollapsed("%cERROR %s: Request %c'%s'%c returned: %s", this.DEBUGCSS.error, args.code, this.DEBUGCSS.uuid, requestID, this.DEBUGCSS.error, args.message);
      if (originalRequest) {
        console.groupCollapsed("Original request");
        console.log(originalRequest);
        console.groupEnd();
      }
      console.log(args);
      console.groupEnd();
    }
  }, {
    key: "logErrorResponse",
    value: function logErrorResponse(requestID, args, originalRequest) {
      console.groupCollapsed("%cERROR: Request %c'" + requestID + "'%c returned with an error status", this.DEBUGCSS.error, this.DEBUGCSS.uuid, this.DEBUGCSS.error);
      if (originalRequest) {
        console.groupCollapsed("Original request");
        console.log(originalRequest);
        console.groupEnd();
      }
      console.log(args);
      console.groupEnd();
    }
  }]);

  return MiddlewareClientDebug;
})(_commonDebugLogger2["default"]);

exports["default"] = new MiddlewareClientDebug();
module.exports = exports["default"];
//# sourceMappingURL=MiddlewareClientDebug.js.map