// Webapp Middleware
// =================
// Handles the lifecycle for the websocket connection to the middleware. This is
// a utility class designed to curate general system data, including user login,
// task and event queues, disconnects, and similar events. Calling action
// creators or passing data to specific "channel" stores is out of scope for
// this class.

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

var _commonWebSocketClient = require("../common/WebSocketClient");

var _commonWebSocketClient2 = _interopRequireDefault(_commonWebSocketClient);

var _commonFreeNASUtil = require("../common/freeNASUtil");

var _commonFreeNASUtil2 = _interopRequireDefault(_commonFreeNASUtil);

var _MiddlewareClientDebug = require("./MiddlewareClientDebug");

var _MiddlewareClientDebug2 = _interopRequireDefault(_MiddlewareClientDebug);

var _storesSubscriptionsStore = require("../stores/SubscriptionsStore");

var _storesSubscriptionsStore2 = _interopRequireDefault(_storesSubscriptionsStore);

var _actionsSubscriptionsActionCreators = require("../actions/SubscriptionsActionCreators");

var _actionsSubscriptionsActionCreators2 = _interopRequireDefault(_actionsSubscriptionsActionCreators);

var _storesMiddlewareStore = require("../stores/MiddlewareStore");

var _storesMiddlewareStore2 = _interopRequireDefault(_storesMiddlewareStore);

var _actionsMiddlewareActionCreators = require("../actions/MiddlewareActionCreators");

var _actionsMiddlewareActionCreators2 = _interopRequireDefault(_actionsMiddlewareActionCreators);

var _storesSessionStore = require("../stores/SessionStore");

var _storesSessionStore2 = _interopRequireDefault(_storesSessionStore);

var _cookies = require("./cookies");

var _cookies2 = _interopRequireDefault(_cookies);

var defaultTimeoutDelay = 10000;

var MiddlewareClient = (function (_WebSocketClient) {
  function MiddlewareClient() {
    _classCallCheck(this, MiddlewareClient);

    _get(Object.getPrototypeOf(MiddlewareClient.prototype), "constructor", this).call(this);
    this.reconnectHandle.setUpdateFunc(function (time) {
      _actionsMiddlewareActionCreators2["default"].updateReconnectTime(time);
    });
    // this.logout = this.logout.bind( this );
    this.queuedLogin = null;
    this.queuedActions = [];
    this.pendingRequests = {};

    // On a successful login, dequeue any actions which may have been requested
    // either before the connection was made, or before the authentication was
    // complete.
    _storesSessionStore2["default"].addChangeListener(this.dequeueActions.bind(this));
  }

  _inherits(MiddlewareClient, _WebSocketClient);

  _createClass(MiddlewareClient, [{
    key: "handleOpen",

    // WEBSOCKET DATA HANDLERS
    // Instance methods for handling data from the WebSocket connection. These are
    // inherited from the WebSocketClient base class, which implements core
    // functionality.

    // Triggered by the WebSocket's onopen event.
    value: function handleOpen() {
      _get(Object.getPrototypeOf(MiddlewareClient.prototype), "handleOpen", this).call(this);

      // Dispatch message stating that we have just connected
      _actionsMiddlewareActionCreators2["default"].updateSocketState("connected");

      // Re-subscribe to any namespaces that may have been active during the
      // session. On the first login, this will do nothing.
      this.renewSubscriptions();

      if (_storesSessionStore2["default"].getLoginStatus() === false) {
        if (_cookies2["default"].obtain("auth") !== null) {
          // If our cookies contain a usable auth token, attempt a login
          this.login("token", _cookies2["default"].obtain("auth"));
        } else if (this.queuedLogin) {
          // If the connection opens and we aren't authenticated, but we have a
          // queued login, dispatch the login and reset its variable.
          this.logPendingRequest(this.queuedLogin.id, this.queuedLogin.successCallback, this.queuedLogin.errorCallback, null);
          this.socket.send(this.queuedLogin.action);
          this.queuedLogin = null;

          if (_MiddlewareClientDebug2["default"].reports("queues")) {
            _MiddlewareClientDebug2["default"].info("Resolving queued login %c" + this.queuedLogin.id, ["uuid"]);
            _MiddlewareClientDebug2["default"].dir(this.queuedLogin.action);
          }
        }
      } else {
        _actionsMiddlewareActionCreators2["default"].receiveAuthenticationChange("", false);
      }
    }
  }, {
    key: "handleClose",

    // Triggered by the WebSocket's `onclose` event. Performs any cleanup
    // necessary to allow for a clean session end and prepares for a new session.
    value: function handleClose() {
      _get(Object.getPrototypeOf(MiddlewareClient.prototype), "handleClose", this).call(this);
      this.queuedLogin = null;
      this.queuedActions = [];

      if (_MiddlewareClientDebug2["default"].reports("connection")) {
        _MiddlewareClientDebug2["default"].info("WebSocket connection closed");
      }

      // Dispatch logout status
      _actionsMiddlewareActionCreators2["default"].receiveAuthenticationChange("", false);
      _actionsMiddlewareActionCreators2["default"].updateSocketState("disconnected");
    }
  }, {
    key: "handleMessage",

    // Triggered by the WebSocket's `onmessage` event. Parses the JSON from the
    // middleware's response, and then performs followup tasks depending on the
    // message's namespace.
    value: function handleMessage(message) {
      _get(Object.getPrototypeOf(MiddlewareClient.prototype), "handleMessage", this).call(this);
      var data = undefined;
      try {
        data = JSON.parse(message.data);
      } catch (error) {
        _MiddlewareClientDebug2["default"].error(["Could not parse JSON from message:", message]);
        return false;
      }

      if (_MiddlewareClientDebug2["default"].reports("messages")) {
        _MiddlewareClientDebug2["default"].info(["Message from Middleware:", data.namespace, message]);
      }

      switch (data.namespace) {

        // A FreeNAS event has occurred
        case "events":
          if (_MiddlewareClientDebug2["default"].reports("messages")) {
            _MiddlewareClientDebug2["default"].log("Message contained event data");
          }
          _actionsMiddlewareActionCreators2["default"].receiveEventData(data);
          break;

        // An RPC call is returning a response
        case "rpc":
          switch (data.name) {
            case "response":
              this.resolvePendingRequest(data.id, data.args, "success");
              break;

            case "error":
              this.resolvePendingRequest(data.id, data.args, "error");
              break;

            default:
              _MiddlewareClientDebug2["default"].warn("Was sent an rpc message from middleware, the client " + "was unable to identify its purpose:");
              _MiddlewareClientDebug2["default"].log(message);
              break;
          }
          break;

        // There was an error with a request or with its execution on FreeNAS
        case "error":
          if (_MiddlewareClientDebug2["default"].reports("messages")) {
            _MiddlewareClientDebug2["default"].error(["Middleware has indicated an error:", data.args]);
          }
          break;

        // A reply was sent from the middleware with no recognizable namespace
        // This shouldn't happen, and probably indicates a problem with the
        // middleware itself.
        default:
          _MiddlewareClientDebug2["default"].warn("Spurious reply from Middleware:", message);
          break;
      }
    }
  }, {
    key: "handleError",

    // CONNECTION ERRORS
    // Triggered by the WebSocket's `onerror` event. Handles errors
    // With the client connection to the middleware.
    value: function handleError(error) {
      _get(Object.getPrototypeOf(MiddlewareClient.prototype), "handleError", this).call(this);
      if (_MiddlewareClientDebug2["default"].reports("connection")) {
        _MiddlewareClientDebug2["default"].error("The WebSocket connection to the Middleware encountered " + "an error:", ["error"]);
      }
    }
  }, {
    key: "handleTimeout",

    // REQUEST TIMEOUTS
    // Called by a request function without a matching response. Automatically
    // triggers resolution of the request with a "timeout" status.
    value: function handleTimeout(reqID) {

      if (_MiddlewareClientDebug2["default"].reports("messages")) {
        _MiddlewareClientDebug2["default"].warn("Request %c'" + reqID + "'%c timed out without a response from " + "the middleware", ["uuid", "normal"]);
      }

      this.resolvePendingRequest(reqID, null, "timeout");
    }
  }, {
    key: "pack",

    // DATA AND REQUEST HANDLING

    // Creates a JSON-formatted object to send to the middleware. Contains the
    // following key-values:
    // "namespace": The target middleware namespace. (eg. "rpc", "events")
    // "name": Name of middleware action within the namespace
    //         (eg. "subscribe", "auth")
    // "args": The arguments to be used by the middleware action
    //         (eg. username and password)
    // "id": The unique UUID used to identify the origin and response If left
    //       blank, `generateUUID` will be called. This is a fallback, and will
    //       likely result in a "Spurious reply" error
    value: function pack(namespace, name, args, id) {
      if (_MiddlewareClientDebug2["default"].reports("packing")) {
        _MiddlewareClientDebug2["default"].logPack.apply(_MiddlewareClientDebug2["default"], arguments);
      }

      return JSON.stringify({ namespace: namespace,
        name: name,
        id: id,
        args: args
      });
    }
  }, {
    key: "processNewRequest",

    // Based on the status of the WebSocket connection and the authentication
    // state, either logs and sends an action, or enqueues it until it can be sent
    value: function processNewRequest(action, onSuccess, onError, id, timeout) {
      if (this.socket) {
        if (this.socket.readyState === 1 && _storesSessionStore2["default"].getLoginStatus()) {

          if (_MiddlewareClientDebug2["default"].reports("logging")) {
            _MiddlewareClientDebug2["default"].info("Logging and sending request %c'" + id + "'", ["uuid"]);
            _MiddlewareClientDebug2["default"].dir(action);
          }

          this.logPendingRequest(id, onSuccess, onError, action, timeout);
          this.socket.send(action);
        } else {

          if (_MiddlewareClientDebug2["default"].reports("queues")) {
            _MiddlewareClientDebug2["default"].info("Enqueueing request %c'" + id + "'", ["uuid"]);
          }

          this.queuedActions.push({ action: action,
            id: id,
            successCallback: onSuccess,
            errorCallback: onError,
            timeout: timeout
          });
        }
      } else {
        _MiddlewareClientDebug2["default"].error("Tried to process a request without an active WebSocket connection");
      }
    }
  }, {
    key: "dequeueActions",

    // Many views' lifecycle will make a request before the connection is made,
    // and before the login credentials have been accepted. These requests are
    // enqueued by the `login` and `request` functions into the `queuedActions`
    // object and `queuedLogin`, and then are dequeued by this function.
    value: function dequeueActions() {

      if (_MiddlewareClientDebug2["default"].reports("queues") && this.queuedActions.length) {
        _MiddlewareClientDebug2["default"].log("Attempting to dequeue actions");
      }

      if (_storesSessionStore2["default"].getLoginStatus()) {
        while (this.queuedActions.length) {
          var request = this.queuedActions.shift();

          if (_MiddlewareClientDebug2["default"].reports("queues")) {
            _MiddlewareClientDebug2["default"].log("Dequeueing %c'" + request.id + "'", ["uuid"]);
          }

          this.processNewRequest(request.action, request.successCallback, request.errorCallback, request.id, request.timeout);
        }
      } else if (_MiddlewareClientDebug2["default"].reports("queues") && this.queuedActions.length) {
        _MiddlewareClientDebug2["default"].info("Cannot dequeue actions: Client is not authenticated");
      }
    }
  }, {
    key: "logPendingRequest",

    // Records a middleware request that was sent to the server, stored in the
    // constructor's `pendingRequests` object. These are eventually resolved and
    // removed, either by a response from the server, or the timeout set here.
    // If `timeoutDelay` is provided, its value will be used for the timeout.
    // Otherwise, the default timeout (10s) is used.
    value: function logPendingRequest(reqID, onSuccess, onError, origReq, timeoutDelay) {

      var delay = timeoutDelay || defaultTimeoutDelay;

      function requestTimeoutHandler() {
        this.handleTimeout(reqID);
      };

      // const newRequest =
      this.pendingRequests[reqID] = { successCallback: onSuccess,
        errorCallback: onError,
        origReq: origReq,
        timeout: setTimeout(requestTimeoutHandler.bind(this), delay)
      };

      // this.pendingRequests[ reqID ] = newRequest;

      if (_MiddlewareClientDebug2["default"].reports("logging")) {
        _MiddlewareClientDebug2["default"].info("Current pending requests:");
        _MiddlewareClientDebug2["default"].dir(this.pendingRequests);
      }
    }
  }, {
    key: "resolvePendingRequest",

    // Resolve a middleware request by clearing its timeout, and optionally
    // calling its callback. Callbacks should not be called if the function timed
    // out before a response was received.
    value: function resolvePendingRequest(reqID, args, outcome) {

      // The server side dispatcher will send a None in the reqID when returing
      // error (code 22): 'Request is not valid JSON'
      if (reqID && this.pendingRequests[reqID]) {
        clearTimeout(this.pendingRequests[reqID].timeout);
      }

      switch (outcome) {
        case "success":
          if (_MiddlewareClientDebug2["default"].reports("messages")) {
            _MiddlewareClientDebug2["default"].info("SUCCESS: Resolving request %c'" + reqID + "'", ["uuid"]);
          }
          this.executeRequestSuccessCallback(reqID, args);
          break;

        case "error":
          var origReq = undefined;

          try {
            origReq = JSON.parse(this.pendingRequests[reqID]["origReq"]);
          } catch (err) {
            _MiddlewareClientDebug2["default"].error(["Could not parse JSON from request %c'" + reqID + "'", this.pendingRequests[reqID]["origReq"]], ["uuid"]);
          }

          this.executeRequestErrorCallback(reqID, args);

          if (args.message && _lodash2["default"].startsWith(args.message, "Traceback")) {
            _MiddlewareClientDebug2["default"].logPythonTraceback(reqID, args, origReq);
          } else if (args.code && args.message) {
            _MiddlewareClientDebug2["default"].logErrorWithCode(reqID, args, origReq);
          } else {
            _MiddlewareClientDebug2["default"].logErrorResponse(reqID, args, origReq);
          }
          break;

        case "timeout":
          if (_MiddlewareClientDebug2["default"].reports("messages")) {
            _MiddlewareClientDebug2["default"].warn("TIMEOUT: Stopped waiting for request %c'" + reqID + "'", ["uuid"]);
          }
          this.executeRequestErrorCallback(reqID, args);
          break;

        default:
          break;
      }

      delete this.pendingRequests[reqID];
    }
  }, {
    key: "executeRequestSuccessCallback",

    // Executes the specified request's successCallback with the provided
    // arguments. Should only be used in cases where a response has come from the
    // server, and the status is successful in one way or another. Calling this
    // function when the server returns an error could cause strange results.
    // Use the errorCallback for that case.
    value: function executeRequestSuccessCallback(reqID, args) {
      if (_lodash2["default"].isFunction(this.pendingRequests[reqID].successCallback)) {
        this.pendingRequests[reqID].successCallback(args);
      }
    }
  }, {
    key: "executeRequestErrorCallback",
    value: function executeRequestErrorCallback(reqID, args) {
      if (_lodash2["default"].isFunction(this.pendingRequests[reqID].errorCallback)) {
        this.pendingRequests[reqID].errorCallback(args);
      }
    }
  }, {
    key: "login",

    // Authenticate a user to the middleware. Basically a specialized version of
    // the `request` function with a different payload.
    value: function login(authType, credentials) {
      var reqID = _commonFreeNASUtil2["default"].generateUUID();
      var rpcName = "auth";
      var payload = undefined;

      if (authType === "userpass") {
        payload = { username: credentials[0],
          password: credentials[1]
        };
      } else if (authType === "token") {
        payload = { token: credentials };
        rpcName = rpcName + "_token";
      }

      var onSuccess = function onSuccess(response) {
        // Making a Cookie for token based login for the next time
        // and setting its max-age to the TTL (in seconds) specified by the
        // middleware response. The token value is stored in the Cookie.
        _cookies2["default"].add("auth", response[0], response[1]);
        _actionsMiddlewareActionCreators2["default"].receiveAuthenticationChange(response[2], true);
      };

      var onError = function onError(args) {
        // TODO: Make LoginBox aware of a failed user/pass error.
        _actionsMiddlewareActionCreators2["default"].receiveAuthenticationChange("", false);
      };

      var action = this.pack("rpc", rpcName, payload, reqID);

      if (this.socket.readyState === 1) {

        if (_MiddlewareClientDebug2["default"].reports("authentication")) {
          _MiddlewareClientDebug2["default"].info("Socket is ready: Sending login request.");
        }

        this.logPendingRequest(reqID, onSuccess, onError, action, null);
        this.socket.send(action);
      } else {

        if (_MiddlewareClientDebug2["default"].reports("authentication")) {
          _MiddlewareClientDebug2["default"].info("Socket is not ready: Deferring login request.");
        }

        this.queuedLogin = { action: action,
          successCallback: onSuccess,
          errorCallback: onerror,
          id: reqID
        };
      }
    }
  }, {
    key: "logout",
    value: function logout() {
      // Deletes the login cookie (which contains the token) and closes the socket
      // connection. `handleClose` is triggered, and the reconnect process begins.
      // For socket close codes (and why 1000 is used here) see the RFC:
      // https://tools.ietf.org/html/rfc6455#page-64
      _cookies2["default"]["delete"]("auth");
      this.disconnect(1000, "User logged out");
    }
  }, {
    key: "request",

    // CHANNELS AND REQUESTS
    // Make a request to the middleware, which translates to an RPC call. A
    // unique UUID is generated for each request, and is supplied to
    // `this.logPendingRequest` as a lookup key for resolving or timing out the
    // Request.
    value: function request(method, args, onSuccess, onError, timeoutDelay) {
      var reqID = _commonFreeNASUtil2["default"].generateUUID();
      var payload = { method: method,
        args: args
      };
      var packedAction = this.pack("rpc", "call", payload, reqID);

      this.processNewRequest(packedAction, onSuccess, onError, reqID, timeoutDelay);
    }
  }, {
    key: "subscribe",

    // SUBSCRIPTION INTERFACES
    // Generic interface for subscribing to Middleware namespaces. The Middleware
    // Flux store records the number of React components which have required a
    // subscription to a Middleware namespace. This allows the Middleware Client
    // to make intelligent decisions about whether to query a namespace for fresh
    // data, begin or end a subscription, or even garbage collect a Flux store
    // which is no longer being used.

    value: function subscribe(masks, componentID) {

      if (!_lodash2["default"].isArray(masks)) {
        _MiddlewareClientDebug2["default"].error("The first argument in MiddlewareClient.subscribe() must " + "be an array of FreeNAS RPC namespaces.");
        return false;
      }

      if (!_lodash2["default"].isString(componentID)) {
        _MiddlewareClientDebug2["default"].error("The second argument in MiddlewareClient.subscribe() must " + "be a string (usually the name of the React component " + "calling it).");
        return false;
      }

      if (_MiddlewareClientDebug2["default"].reports("subscriptions")) {
        _MiddlewareClientDebug2["default"].logNewSubscriptionMasks(masks);
      }

      _lodash2["default"].forEach(masks, function (mask) {
        var subCount = _storesSubscriptionsStore2["default"].getNumberOfSubscriptionsForMask(mask);

        if (_MiddlewareClientDebug2["default"].reports("subscriptions")) {
          _MiddlewareClientDebug2["default"].logSubscription(subCount, mask);
        }

        if (subCount < 1) {
          var reqID = _commonFreeNASUtil2["default"].generateUUID();
          var action = this.pack("events", "subscribe", [mask], reqID);

          this.processNewRequest(action, null, null, reqID, null);
        }
      }, this);

      _actionsSubscriptionsActionCreators2["default"].recordNewSubscriptions(masks, componentID);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(masks, componentID) {

      if (!_lodash2["default"].isArray(masks)) {
        _MiddlewareClientDebug2["default"].warn("The first argument in MiddlewareClient.unsubscribe() must " + "be an array of FreeNAS RPC namespaces.");
        return;
      }

      if (!_lodash2["default"].isString(componentID)) {
        _MiddlewareClientDebug2["default"].warn("The second argument in MiddlewareClient.unsubscribe() must " + "be a string (usually the name of the React component " + "calling it).");
        return;
      }

      if (_MiddlewareClientDebug2["default"].reports("subscriptions")) {
        _MiddlewareClientDebug2["default"].logUnsubscribeMasks(masks);
      }

      _lodash2["default"].forEach(masks, function (mask) {
        var subCount = _storesSubscriptionsStore2["default"].getNumberOfSubscriptionsForMask(mask);

        if (subCount === 1) {
          var reqID = _commonFreeNASUtil2["default"].generateUUID();
          var action = this.pack("events", "unsubscribe", [mask], reqID);

          this.processNewRequest(action, null, null, reqID, null);
        }
      }, this);

      _actionsSubscriptionsActionCreators2["default"].deleteCurrentSubscriptions(masks, componentID);
    }
  }, {
    key: "renewSubscriptions",
    value: function renewSubscriptions() {
      var masks = _lodash2["default"].keys(_storesSubscriptionsStore2["default"].getAllSubscriptions());
      _lodash2["default"].forEach(masks, function (mask) {
        if (_MiddlewareClientDebug2["default"].reports("subscriptions")) {
          _MiddlewareClientDebug2["default"].log("Renewing subscription request for %c'" + mask + "' ", ["args", "normal"]);
        }

        var reqID = _commonFreeNASUtil2["default"].generateUUID();
        var action = this.pack("events", "subscribe", [mask], reqID);

        this.processNewRequest(action, null, null, reqID, null);
      }, this);
    }
  }, {
    key: "unsubscribeALL",
    value: function unsubscribeALL() {
      var masks = _lodash2["default"].keys(_storesSubscriptionsStore2["default"].getAllSubscriptions());
      _lodash2["default"].forEach(masks, function (mask) {
        if (_MiddlewareClientDebug2["default"].reports("subscriptions")) {
          _MiddlewareClientDebug2["default"].log("Requested: Unsubscribe to %c'" + mask + "'%c events", ["args", "normal"]);
        }

        var reqID = _commonFreeNASUtil2["default"].generateUUID();
        var action = this.pack("events", "unsubscribe", [mask], reqID);

        this.processNewRequest(action, null, null, reqID, null);
      }, this);

      _actionsSubscriptionsActionCreators2["default"].deleteAllSubscriptions();
    }
  }, {
    key: "getServices",

    // MIDDLEWARE DISCOVERY METHODS
    // These are instance methods used to request information about the
    // Middleware server's capabilities and overall state. These can be used to
    // return a list of services supported by your connection to the middleware,
    // and methods supported by each service.

    value: function getServices() {
      this.request("discovery.get_services", [], function (services) {
        _actionsMiddlewareActionCreators2["default"].receiveAvailableServices(services);
      });
    }
  }, {
    key: "getMethods",
    value: function getMethods(service) {
      this.request("discovery.get_methods", [service], function (methods) {
        _actionsMiddlewareActionCreators2["default"].receiveAvailableServiceMethods(service, methods);
      });
    }
  }]);

  return MiddlewareClient;
})(_commonWebSocketClient2["default"]);

exports["default"] = new MiddlewareClient();
module.exports = exports["default"];
//# sourceMappingURL=MiddlewareClient.js.map