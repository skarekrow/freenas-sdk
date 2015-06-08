// WEBSOCKET CLIENT
// ================
// A simple base class for the WebSocket clients used by FreeNAS 10. Implements
// some shared functionality that all WS clients rely on.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _DebugLogger = require("./DebugLogger");

var _DebugLogger2 = _interopRequireDefault(_DebugLogger);

var DL = new _DebugLogger2["default"]("MIDDLEWARE_CLIENT_DEBUG");

// Modified fibonacci series to use with stepped timeout
var MODFIBONACCI = [5000, 8000, 13000, 21000, 34000];

// Timer object (code taken from: http://stackoverflow.com/questions/3144711/...
// ...javascript-find-the-time-left-in-a-settimeout/20745721#20745721)
// the above code is modified to be able to suit what we need it to do
// This is primarily needed so that the reconnection interval can be
// obtained at the same time while the timer is in use.
// delay is to be specified in milliseconds (example 10000 for 10 seconds)
function ReconnectTimer(doAfter, delay) {
  var idTimeout = undefined,
      idInterval = undefined,
      running = undefined;
  var remaining = 0;
  var updateFunc = function updateFunc() {};
  var modAfter = function modAfter() {
    running = false;
    remaining = 0;
    doAfter();
  };
  if (delay && typeof delay !== "undefined") {
    remaining = delay;
  }

  var myCusTimeout = function myCusTimeout(code, delay, listener, interval) {
    var elapsed = 0;
    var h = undefined;
    h = setInterval(function () {
      elapsed += interval;
      if (elapsed < delay) {
        listener(delay - elapsed);
      } else {
        clearInterval(h);
      }
    }, interval);
    return [h, setTimeout(code, delay)];
  };

  var modUpdateFunc = function modUpdateFunc(t) {
    remaining = t;
    updateFunc(t);
  };

  this.setUpdateFunc = function (foo) {
    updateFunc = foo;
  };

  this.start = function (delay) {
    if (delay) {
      remaining = delay;
    }
    running = true;

    var _myCusTimeout = myCusTimeout(modAfter, remaining, modUpdateFunc, 100);

    var _myCusTimeout2 = _slicedToArray(_myCusTimeout, 2);

    idInterval = _myCusTimeout2[0];
    idTimeout = _myCusTimeout2[1];
  };

  this.pause = function () {
    running = false;
    clearTimeout(idTimeout);
    clearInterval(idInterval);
  };

  this.getTimeLeft = function () {
    if (running) {
      return remaining;
    } else {
      remaining = 0;
      return 0;
    }
  };

  this.isRunning = function () {
    if (remaining === 0) {
      running = false;
    };
    return running;
  };

  this.stop = function () {
    clearTimeout(idTimeout);
    clearInterval(idInterval);
    running = false;
    this.remaining = 0;
  };

  this.reconnectNow = function () {
    this.stop();
    doAfter();
  };
};

var WebSocketClient = (function () {
  function WebSocketClient() {
    _classCallCheck(this, WebSocketClient);

    // Counter for stepped timeout
    this.k = -1;
    this.socket = null;

    // Publically accessible reconectHandle
    this.reconnectHandle = new ReconnectTimer((function () {
      var protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
      this.connect(protocol + document.domain + ":5000/socket");
    }).bind(this));
  }

  _createClass(WebSocketClient, [{
    key: "connect",

    // This method should only be called when there's no existing connection. If
    // for some reason, the existing connection should be ignored and overridden,
    // supply `true` as the `force` parameter.
    value: function connect(url, force) {
      if (window.WebSocket) {
        if (!this.socket || force) {

          if (DL.reports("connection")) {
            DL.info("Creating WebSocket instance");
          }

          if (force) {
            DL.warn("Forcing creation of new WebSocket instance");
          }

          this.socket = new WebSocket(url);

          _lodash2["default"].assign(this.socket, { onopen: this.handleOpen.bind(this),
            onmessage: this.handleMessage.bind(this),
            onerror: this.handleError.bind(this),
            onclose: this.handleClose.bind(this)
          }, this);
        } else if (DL.reports("connection")) {
          DL.warn("Attempted to create a new WebSocket connection while a " + "connection already exists.");
        }
      } else {
        // TODO: Visual error for legacy browsers with links to download others
        DL.error("This browser doesn't support WebSockets.");
      }
    }
  }, {
    key: "disconnect",

    // Shortcut method for closing the WebSocket connection. Will also trigger
    // `handleClose` for any cleanup that needs to happen.
    value: function disconnect(code, reason) {
      this.socket.close(code, reason);
    }
  }, {
    key: "handleOpen",
    value: function handleOpen() {
      // Set stepped reconnect counter back to 0
      this.k = -1;
    }
  }, {
    key: "handleMessage",
    value: function handleMessage() {}
  }, {
    key: "handleError",
    value: function handleError() {}
  }, {
    key: "handleClose",
    value: function handleClose() {
      this.socket = null;
      if (this.reconnectHandle.isRunning()) {
        this.reconnectHandle.stop();
      }
      // Increase k in a cyclic fashion (it goes back to 0 after reachin 4)
      this.k = ++this.k % MODFIBONACCI.length;
      this.reconnectHandle.start(MODFIBONACCI[this.k]);
      // Uncomment the below if debugging the reconnect timer, else let it be!
      // var _this = this;
      // ( function checkReconnectHandle ( ) {
      //     let tvar = 0;
      //     setTimeout( function () {
      //       if ( _this.reconnectHandle.isRunning() ) {
      //         let temp = Math.round( _this.reconnectHandle.getTimeLeft()/1000);
      //         if ( temp !== tvar ) {
      //           tvar = temp;
      //           console.log( tvar, " seconds to reconnection..." );
      //         };
      //         checkReconnectHandle();       // Call checkReconnectHandle again
      //       }
      //     }, 1000 );
      //   }() );
    }
  }]);

  return WebSocketClient;
})();

exports["default"] = WebSocketClient;
module.exports = exports["default"];
//# sourceMappingURL=WebSocketClient.js.map
