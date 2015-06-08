// Option Flags Debug Tab
// ======================

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _commonToggleSwitch = require("../common/ToggleSwitch");

var _commonToggleSwitch2 = _interopRequireDefault(_commonToggleSwitch);

var Options = _react2["default"].createClass({
  displayName: "Options",

  getInitialState: function getInitialState() {
    return {
      MIDDLEWARE_CLIENT_DEBUG: {
        connection: false,
        authentication: false,
        packing: false,
        logging: false,
        queues: false,
        subscriptions: false,
        messages: false
      }
    };
  },

  componentDidMount: function componentDidMount() {
    window.DEBUG_FLAGS = this.state;
  },

  componentWillUnmount: function componentWillUnmount() {
    window.DEBUG_FLAGS = null;
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    window.DEBUG_FLAGS = this.state;
  },

  handleFlagToggle: function handleFlagToggle(flag) {
    var tempFlags = this.state.MIDDLEWARE_CLIENT_DEBUG;

    tempFlags[flag] = !tempFlags[flag];

    this.setState({
      MIDDLEWARE_CLIENT_DEBUG: tempFlags
    });
  },

  createMiddlewareFlag: function createMiddlewareFlag(flag, label, description) {
    return _react2["default"].createElement(
      _reactBootstrap2["default"].Row,
      null,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 3, className: "text-center" },
        _react2["default"].createElement(
          "h6",
          null,
          label
        ),
        _react2["default"].createElement(_commonToggleSwitch2["default"], {
          sm: true,
          toggled: this.state.MIDDLEWARE_CLIENT_DEBUG[flag],
          onChange: this.handleFlagToggle.bind(null, flag) })
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 9, className: "debug-options-label" },
        _react2["default"].createElement(
          "p",
          null,
          description
        )
      )
    );
  },

  render: function render() {

    return _react2["default"].createElement(
      "div",
      { className: "debug-content-flex-wrapper debug-options" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Middleware Debug Message Flags"
        ),
        _react2["default"].createElement(
          "div",
          { className: "debug-column-content well well-sm" },
          this.createMiddlewareFlag("connection", "Middleware Connection", "Events and information about the state of all clients' connections to the FreeNAS Middleware Server, including disconnection events."),
          _react2["default"].createElement("hr", null),
          this.createMiddlewareFlag("authentication", "Client Authentication", "Events regarding the authentication status of connected clients."),
          _react2["default"].createElement("hr", null),
          this.createMiddlewareFlag("packing", "Request Packing", "'Packing' is the process of encoding a JSON-formatted object to send to the Middleware Server. Includes the resulting pack, or an error dump outlining reasons for an encoding failure."),
          _react2["default"].createElement("hr", null),
          this.createMiddlewareFlag("logging", "Pending and Logged Requests", "A 'logged' request is a middleware request that was sent to the server, stored in the private `pendingRequests` object. These are eventually resolved and removed, either by a response from the server, or a timeout."),
          _react2["default"].createElement("hr", null),
          this.createMiddlewareFlag("queues", "Queued Requests", "Many views' lifecycle will make a request before the connection is made, and before the login credentials have been accepted. These requests are enqueued by the `login` and `request` functions into the `queuedActions` object and `queuedLogin`, and then are dequeued once a valid authorization event has occurred."),
          _react2["default"].createElement("hr", null),
          this.createMiddlewareFlag("subscriptions", "Subscription Events", "Subscribe and unsubscribe events, as well as information about the logged number of active subscriptions, and their trends."),
          _react2["default"].createElement("hr", null),
          this.createMiddlewareFlag("messages", "Message Events", "General message events from the Middleware Server.")
        )
      ),
      _react2["default"].createElement(_reactBootstrap2["default"].Col, { xs: 6, className: "debug-column" })
    );
  }

});

module.exports = Options;
/* TODO: Should something go here? */
//# sourceMappingURL=Options.js.map
