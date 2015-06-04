// DEBUG TOOLS
// ===========
// A simple pane that acts as a companion to the development tools in your
// browser. Offers direct access to the middleware connection FreeNAS is using,
// as well as some debugging helpers.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

// Events

var _DebugToolsEventBus = require("./DebugTools/EventBus");

var _DebugToolsEventBus2 = _interopRequireDefault(_DebugToolsEventBus);

// Tabs

var _DebugToolsRPC = require("./DebugTools/RPC");

var _DebugToolsRPC2 = _interopRequireDefault(_DebugToolsRPC);

var _DebugToolsEvents = require("./DebugTools/Events");

var _DebugToolsEvents2 = _interopRequireDefault(_DebugToolsEvents);

var _DebugToolsSubscriptions = require("./DebugTools/Subscriptions");

var _DebugToolsSubscriptions2 = _interopRequireDefault(_DebugToolsSubscriptions);

var _DebugToolsTasks = require("./DebugTools/Tasks");

var _DebugToolsTasks2 = _interopRequireDefault(_DebugToolsTasks);

var _DebugToolsOptions = require("./DebugTools/Options");

var _DebugToolsOptions2 = _interopRequireDefault(_DebugToolsOptions);

var _DebugToolsTerminal = require("./DebugTools/Terminal");

var _DebugToolsTerminal2 = _interopRequireDefault(_DebugToolsTerminal);

// Local variables
var initialPanelHeight;
var initialY;

var DebugTools = _react2["default"].createClass({
  displayName: "DebugTools",
  getInitialState: function getInitialState() {
    return { isVisible: false,
      panelHeight: 350
    };
  },

  handleResizeStart: function handleResizeStart(event) {
    event.stopPropagation();
    event.preventDefault();

    initialPanelHeight = this.state.panelHeight;
    initialY = event.nativeEvent.clientY;

    window.addEventListener("mouseup", this.handleResizeStop);
    window.addEventListener("mousemove", this.handleResizeProgress);
  },

  handleResizeProgress: function handleResizeProgress(event, foo) {
    this.setState({
      panelHeight: initialPanelHeight - (event.clientY - initialY)
    });
  },

  handleResizeStop: function handleResizeStop(event) {
    event.stopPropagation();
    event.preventDefault();

    window.removeEventListener("mouseup", this.handleResizeStop);
    window.removeEventListener("mousemove", this.handleResizeProgress);
  },

  handleKeypress: function handleKeypress(event) {
    if (event.which === 192 && event.ctrlKey && event.shiftKey) {
      this.toggleVisibility();
    }
  },

  toggleVisibility: function toggleVisibility() {
    if (this.state.isVisible) {
      this.setState({ isVisible: false });
    } else {
      this.setState({ isVisible: true });
    }
  },

  componentDidMount: function componentDidMount() {
    _DebugToolsEventBus2["default"].addListener(this.toggleVisibility);
    window.addEventListener("keyup", this.handleKeypress);
  },

  componentWillUnmount: function componentWillUnmount() {
    _DebugToolsEventBus2["default"].removeListener(this.toggleVisibility);
    window.removeEventListener("keyup", this.handleKeypress);
  },

  render: function render() {
    var content = null;

    if (this.state.isVisible) {
      content = _react2["default"].createElement(
        "div",
        { className: "debug-panel",
          style: { height: this.state.panelHeight + "px" } },
        _react2["default"].createElement(
          _reactBootstrap2["default"].TabbedArea,
          { className: "debug-nav",
            onMouseDown: this.handleResizeStart },
          _react2["default"].createElement(
            _reactBootstrap2["default"].TabPane,
            { eventKey: 1, tab: "RPC" },
            _react2["default"].createElement(_DebugToolsRPC2["default"], null)
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].TabPane,
            { eventKey: 2, tab: "Events" },
            _react2["default"].createElement(_DebugToolsEvents2["default"], null)
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].TabPane,
            { eventKey: 3, tab: "Subscriptions" },
            _react2["default"].createElement(_DebugToolsSubscriptions2["default"], null)
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].TabPane,
            { eventKey: 4, tab: "Tasks" },
            _react2["default"].createElement(_DebugToolsTasks2["default"], null)
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].TabPane,
            { eventKey: 6, tab: "Options" },
            _react2["default"].createElement(_DebugToolsOptions2["default"], null)
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].TabPane,
            { eventKey: 7, tab: "Terminal" },
            _react2["default"].createElement(_DebugToolsTerminal2["default"], null)
          )
        )
      );
    }

    return content;
  }
});

module.exports = DebugTools;
/* RPC Interface */ /* Event Log */ /* Subscriptions List */ /* Task Log and Queue */ /* Debugging Options */ /* Web Console */
//# sourceMappingURL=DebugTools.js.map