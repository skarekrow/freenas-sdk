// Notification Bar
// ================
// Part of the main webapp's window chrome. Positioned at the top of the page,
// this bar details the alerts, events, and tasks that represent the current
// state of the system

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _Icon = require("../Icon");

var _Icon2 = _interopRequireDefault(_Icon);

var _middlewareMiddlewareClient = require("../../middleware/MiddlewareClient");

var _middlewareMiddlewareClient2 = _interopRequireDefault(_middlewareMiddlewareClient);

var LogQueue = _react2["default"].createClass({
  displayName: "LogQueue",

  propTypes: {
    glyph: _react2["default"].PropTypes.string.isRequired,
    className: _react2["default"].PropTypes.string,
    active: _react2["default"].PropTypes.array,
    log: _react2["default"].PropTypes.array
  },

  handleToggleClick: function handleToggleClick(event) {
    if (this.props.visible === false) {
      event.stopPropagation();
      this.props.requestVisibility();
    }
  },

  handleNullClick: function handleNullClick(event) {
    event.stopPropagation();
  },

  createLogItem: function createLogItem(rawItem, index) {

    var statusDisplay;

    switch (rawItem.status) {
      case "in-progress":
        statusDisplay = _react2["default"].createElement(_reactBootstrap2["default"].ProgressBar, { bsStyle: "info", now: rawItem.progress, label: "%(percent)s%" });
        break;

      case "pending":
        statusDisplay = _react2["default"].createElement(_reactBootstrap2["default"].ProgressBar, { active: true, bsStyle: "info", now: 100 });
        break;

      case "warning":
      case "info":
      case "done":
        statusDisplay = _react2["default"].createElement(
          "span",
          null,
          rawItem.details
        );
        break;

      default:
        // Do nothing
        statusDisplay = _react2["default"].createElement("span", null);
        break;
    }

    return _react2["default"].createElement(
      "div",
      { key: index,
        className: "item" },
      _react2["default"].createElement(
        "h4",
        null,
        rawItem.description
      ),
      _react2["default"].createElement(
        "div",
        { className: "details" },
        rawItem.details
      ),
      _react2["default"].createElement(
        "div",
        { className: "info" },
        rawItem.info
      ),
      _react2["default"].createElement(
        "div",
        { className: "status" },
        statusDisplay
      )
    );
  },

  render: function render() {
    var activeSection = null;
    var logSection = null;

    if (this.props.active.length) {
      activeSection = _react2["default"].createElement(
        "span",
        null,
        _react2["default"].createElement(
          "h4",
          null,
          "ACTIVE"
        ),
        this.props.active.map(this.createLogItem)
      );
    }
    if (this.props.log.length) {
      logSection = _react2["default"].createElement(
        "span",
        null,
        _react2["default"].createElement(
          "h4",
          null,
          "LOG"
        ),
        this.props.log.map(this.createLogItem)
      );
    }

    return _react2["default"].createElement(
      "div",
      { className: "notification-bar-icon",
        onClick: this.handleToggleClick },
      _react2["default"].createElement(_Icon2["default"], { glyph: this.props.glyph,
        icoSize: "3x",
        badgeContent: this.props.active.length }),
      _react2["default"].createElement(
        "div",
        { className: ["notification-box", this.props.className, this.props.visible ? "visible" : "hidden"].join(" "),
          onClick: this.handleNullClick },
        _react2["default"].createElement(
          "div",
          { className: "notification-box-header" },
          _react2["default"].createElement(
            "span",
            null,
            "You have ",
            _react2["default"].createElement(
              "strong",
              null,
              this.props.active.length,
              " new "
            ),
            " events "
          ),
          _react2["default"].createElement(
            "a",
            { className: "right", href: "#" },
            "View all"
          )
        ),
        activeSection,
        logSection
      )
    );
  }

});

var NotificationBar = _react2["default"].createClass({
  displayName: "NotificationBar",

  getInitialState: function getInitialState() {
    return {
      visibleLog: ""

      // TODO: Replace dummy data with Middleware data in a Flux store
      , active: {
        alerts: [{
          description: _react2["default"].createElement(
            "span",
            null,
            "Reading Error at position 456 in pool ",
            _react2["default"].createElement(
              "strong",
              null,
              "HONK1"
            )
          ),
          status: "warning",
          details: "Error code #1234 Details about this error"
        }, {
          description: _react2["default"].createElement(
            "span",
            null,
            "Reading Error at position 123 in pool ",
            _react2["default"].createElement(
              "strong",
              null,
              "HONK1"
            )
          ),
          status: "warning",
          details: "Error code #1234 Details about this error"
        }, {
          description: _react2["default"].createElement(
            "span",
            null,
            "Reading Error at position 123 in pool ",
            _react2["default"].createElement(
              "strong",
              null,
              "HONK1"
            )
          ),
          status: "warning",
          details: "Error code #1234 Details about this error"
        }, {
          description: _react2["default"].createElement(
            "span",
            null,
            "Reading Error at position 123 in pool ",
            _react2["default"].createElement(
              "strong",
              null,
              "HONK1"
            )
          ),
          status: "warning",
          details: "Error code #1234 Details about this error"
        }],
        events: [{
          description: _react2["default"].createElement(
            "span",
            null,
            "User ",
            _react2["default"].createElement(
              "strong",
              null,
              "Jakub Klama"
            ),
            " logged in as ",
            _react2["default"].createElement(
              "strong",
              null,
              "administrator"
            )
          ),
          status: "info",
          details: "Nov 14 11:20am"
        }],
        actions: [{
          description: _react2["default"].createElement(
            "span",
            null,
            "Running ",
            _react2["default"].createElement(
              "strong",
              null,
              "SCRUB"
            ),
            " on pool ",
            _react2["default"].createElement(
              "strong",
              null,
              "HONK1"
            )
          ),
          status: "in-progress",
          progress: 60,
          details: "Run by Jakub Klama 11 minutes ago"
        }, {
          description: _react2["default"].createElement(
            "span",
            null,
            "Waiting to run ",
            _react2["default"].createElement(
              "strong",
              null,
              "SCRUB"
            ),
            " on pool ",
            _react2["default"].createElement(
              "strong",
              null,
              "KEVIN"
            )
          ),
          status: "pending",
          progress: 0,
          details: "Run by Jakub Klama 3 minutes ago",
          info: "Waiting for previous task (Scrub on pool HONK1)"
        }]
      }

      // TODO: Replace dummy data with Middleware data in a Flux store
      , log: {
        alerts: [],
        events: [{
          description: _react2["default"].createElement(
            "span",
            null,
            "User ",
            _react2["default"].createElement(
              "strong",
              null,
              "Kevin Bacon"
            ),
            " created dataset ",
            _react2["default"].createElement(
              "strong",
              null,
              "KEVIN"
            )
          ),
          status: "info",
          details: "Nov 14 11:10am"
        }],
        actions: []
      }
    };
  },

  componentDidMount: function componentDidMount() {
    window.addEventListener("click", this.makeAllInvisible);
  },

  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener("click", this.makeAllInvisible);
  },

  makeAllInvisible: function makeAllInvisible(event) {
    this.setState({ visibleLog: "" });
  },
  makeEventsVisible: function makeEventsVisible(event) {
    this.setState({ visibleLog: "events" });
  },
  makeAlertsVisible: function makeAlertsVisible(event) {
    this.setState({ visibleLog: "alerts" });
  },
  makeActionsVisible: function makeActionsVisible(event) {
    this.setState({ visibleLog: "actions" });
  },

  render: function render() {
    return _react2["default"].createElement(
      "header",
      { className: "notification-bar" },
      _react2["default"].createElement(
        "div",
        { className: "user-info" },
        _react2["default"].createElement(LogQueue, { glyph: "info-circle",
          className: "notification-info",
          requestVisibility: this.makeEventsVisible,
          visible: this.state.visibleLog === "events",
          active: this.state.active.events,
          log: this.state.log.events }),
        _react2["default"].createElement(LogQueue, { glyph: "warning",
          className: "notification-warning",
          requestVisibility: this.makeAlertsVisible,
          visible: this.state.visibleLog === "alerts",
          active: this.state.active.alerts,
          log: this.state.log.alerts }),
        _react2["default"].createElement(LogQueue, { glyph: "list-alt",
          className: "notification-default",
          requestVisibility: this.makeActionsVisible,
          visible: this.state.visibleLog === "actions",
          active: this.state.active.actions,
          log: this.state.log.actions }),
        _react2["default"].createElement(_Icon2["default"], { glyph: "user", icoSize: "2x" }),
        _react2["default"].createElement(
          _reactBootstrap2["default"].SplitButton,
          { title: "Kevin Spacey", pullRight: true },
          _react2["default"].createElement(
            _reactBootstrap2["default"].MenuItem,
            { key: "1" },
            "Camera!"
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].MenuItem,
            { key: "2" },
            "Action!"
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].MenuItem,
            { key: "3" },
            "Cut!"
          ),
          _react2["default"].createElement(_reactBootstrap2["default"].MenuItem, { divider: true }),
          _react2["default"].createElement(
            _reactBootstrap2["default"].MenuItem,
            { key: "4",
              onClick: _middlewareMiddlewareClient2["default"].logout.bind(_middlewareMiddlewareClient2["default"]) },
            "Logout"
          )
        )
      )
    );
  }
});

module.exports = NotificationBar;
/* System Events */ /* Alert Messages */ /* System Tasks/Actions */
//# sourceMappingURL=NotificationBar.js.map
