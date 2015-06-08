// Busy Box
// =========
// Just a Busy Spinner for Restarts and Shutdowns

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

// Middleware

var _middlewareMiddlewareClient = require("../middleware/MiddlewareClient");

var _middlewareMiddlewareClient2 = _interopRequireDefault(_middlewareMiddlewareClient);

// Middleware Store (this is needed for reconnection interval)

var _storesMiddlewareStore = require("../stores/MiddlewareStore");

var _storesMiddlewareStore2 = _interopRequireDefault(_storesMiddlewareStore);

// SessionStore stores the logged in user and the fact that login happened.

var _storesSessionStore = require("../stores/SessionStore");

var _storesSessionStore2 = _interopRequireDefault(_storesSessionStore);

// PowerStore

var _storesPowerStore = require("../stores/PowerStore");

var _storesPowerStore2 = _interopRequireDefault(_storesPowerStore);

// Power Middleware

var _middlewarePowerMiddleware = require("../middleware/PowerMiddleware");

var _middlewarePowerMiddleware2 = _interopRequireDefault(_middlewarePowerMiddleware);

// Throbber

var _commonThrobber = require("./common/Throbber");

var _commonThrobber2 = _interopRequireDefault(_commonThrobber);

// Twitter Bootstrap React components

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var componentLongName = "BusyBox";

var BusyBox = _react2["default"].createClass({
  displayName: "BusyBox",
  propTypes: { animDuration: _react2["default"].PropTypes.number,
    animDelay: _react2["default"].PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return { animDuration: 500,
      animDelay: 0
    };
  },

  getInitialState: function getInitialState() {
    return { boxIsVisible: false,
      userText: "",
      passText: "",
      busyText: "Busy",
      kickin: false,
      loggedIn: _storesSessionStore2["default"].getLoginStatus(),
      operation: "Connect you to FreeNAS",
      reconnetTime: 0,
      sockState: false
    };
  },

  componentDidMount: function componentDidMount() {
    _storesSessionStore2["default"].addChangeListener(this.handleSessionChange);
    _storesPowerStore2["default"].addChangeListener(this.handlePowerChange);
    _storesMiddlewareStore2["default"].addChangeListener(this.handleMiddlewareChange);
    _middlewarePowerMiddleware2["default"].subscribe(componentLongName);
    // this.updateBoxVisibility();
    // TODO: do we need the above?
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesPowerStore2["default"].removeChangeListener(this.handlePowerChange);
    _storesSessionStore2["default"].removeChangeListener(this.handleSessionChange);
    _storesMiddlewareStore2["default"].removeChangeListener(this.handleMiddlewareChange);
    _middlewarePowerMiddleware2["default"].unsubscribe(componentLongName);
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (prevState.kickin !== this.state.kickin || prevState.loggedIn !== this.state.loggedIn || prevState.sockState !== this.state.sockState) {
      this.updateBoxVisibility();
    }
  },

  updateBoxVisibility: function updateBoxVisibility() {
    if (this.state.kickin || !this.state.loggedIn || !this.state.sockState) {
      if (!this.state.boxIsVisible) {
        this.showBusyBox();
      };
    } else {
      if (this.state.boxIsVisible) {
        this.showBusyBox();
      };
    }
  },

  showBusyBox: function showBusyBox() {
    this.setState({ boxIsVisible: true });
    // clear the cached password!
    this.setState({ passText: "" });
    Velocity(_react2["default"].findDOMNode(this.refs.Busy), "fadeIn", { duration: this.props.animDuration });
  },

  hideBusyBox: function hideBusyBox() {
    this.setState({ boxIsVisible: false });
    Velocity(_react2["default"].findDOMNode(this.refs.Busy), "fadeOut", { duration: this.props.animDuration,
      delay: this.props.animDelay });

    this.animTimeout = setTimeout((function () {
      this.setState({ boxIsVisible: false });
    }).bind(this), this.props.animDuration + this.props.animDelay + 250);
  },

  handleSessionChange: function handleSessionChange() {
    this.setState({ loggedIn: _storesSessionStore2["default"].getLoginStatus() });
  },

  handlePowerChange: function handlePowerChange() {
    var retcode = _storesPowerStore2["default"].isEventPending();
    this.setState({ kickin: retcode[0],
      operation: retcode[1]
    });
  },

  handleMiddlewareChange: function handleMiddlewareChange() {
    var retcode = _storesMiddlewareStore2["default"].getSockState();
    this.setState({ sockState: retcode[0],
      reconnetTime: Math.round(retcode[1] / 1000)
    });
  },

  handleUserChange: function handleUserChange(event) {
    this.setState({ userText: event.target.value });
  },

  handlePassChange: function handlePassChange(event) {
    this.setState({ passText: event.target.value });
  },

  handleKeydown: function handleKeydown(event) {
    if (event.which === 13 && this.state.userText.length) {
      this.handleLoginClick();
    }
  },

  handleLoginClick: function handleLoginClick(event) {
    // TODO: Input validation for user/pass. What are the rules?
    _middlewareMiddlewareClient2["default"].login("userpass", [this.state.userText, this.state.passText]);
  },

  render: function render() {
    var busyBody = _react2["default"].createElement("div", { ref: "Busy", style: { opacity: 0 } });

    if (this.state.boxIsVisible) {
      if (!this.state.sockState || this.state.kickin) {
        var throbberprops = {};
        throbberprops.bsStyle = "primary";
        throbberprops.size = 60;
        var dispMsg = _react2["default"].createElement(
          "h2",
          null,
          "Please wait while I " + this.state.operation
        );
        if (!this.state.sockState) {
          dispMsg = _react2["default"].createElement(
            "span",
            null,
            _react2["default"].createElement(
              "h2",
              null,
              "Reconnection you to FreeNAS in " + this.state.reconnetTime + " seconds"
            ),
            _react2["default"].createElement(
              _reactBootstrap2["default"].Button,
              { block: true, bsStyle: "info",
                onClick: _middlewareMiddlewareClient2["default"].reconnectHandle.reconnectNow.bind(_middlewareMiddlewareClient2["default"].reconnectHandle) },
              "Reconnect Now"
            ),
            _react2["default"].createElement("br", null)
          );
        }

        busyBody = _react2["default"].createElement(
          "div",
          { className: "overlay-dark", ref: "Busy", style: { opacity: 0 } },
          _react2["default"].createElement(
            "div",
            { className: "overlay-window" },
            _react2["default"].createElement(
              "div",
              null,
              dispMsg,
              _react2["default"].createElement(_commonThrobber2["default"], throbberprops)
            )
          )
        );
      } else if (!this.state.loggedIn) {
        busyBody = _react2["default"].createElement(
          "div",
          { className: "overlay-dark", ref: "Busy", style: { opacity: 0 } },
          _react2["default"].createElement(
            "div",
            { className: "overlay-window" },
            _react2["default"].createElement(
              "h3",
              null,
              "Welcome to FreeNAS 10"
            ),
            _react2["default"].createElement("hr", null),
            _react2["default"].createElement(
              "div",
              { className: "form-group" },
              _react2["default"].createElement("input", { className: "form-control",
                type: "text",
                value: this.state.userText,
                onChange: this.handleUserChange,
                onKeyDown: this.handleKeydown,
                placeholder: "Username" })
            ),
            _react2["default"].createElement(
              "div",
              { className: "form-group" },
              _react2["default"].createElement("input", { className: "form-control",
                type: "password",
                value: this.state.passText,
                onChange: this.handlePassChange,
                onKeyDown: this.handleKeydown,
                placeholder: "Password" })
            ),
            _react2["default"].createElement(
              _reactBootstrap2["default"].Button,
              { block: true, bsStyle: "info",
                disabled: this.state.userText.length ? false : true,
                onClick: this.handleLoginClick },
              "Sign In"
            )
          )
        );
      }
    }

    return busyBody;
  }

});

module.exports = BusyBox;
//# sourceMappingURL=BusyBox.js.map
