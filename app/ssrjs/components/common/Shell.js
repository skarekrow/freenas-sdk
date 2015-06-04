// SHELL
// =====
// Common-use React component wrapping the various different shells that FreeNAS
// supports. Handles its own lifecycle and does not rely on a Flux store. Since
// it relies on single-use authentication tokens and has no persistent data,
// there is no need for the standard data flow model.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _termJs = require("term.js");

var _termJs2 = _interopRequireDefault(_termJs);

var _middlewareShellMiddleware = require("../../middleware/ShellMiddleware");

var _middlewareShellMiddleware2 = _interopRequireDefault(_middlewareShellMiddleware);

var Shell = _react2["default"].createClass({
  displayName: "Shell",
  ws: null,
  term: null,
  isAuthenticated: false,

  propTypes: {
    shellType: _react2["default"].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      shellType: "/bin/sh"
    };
  },

  componentDidMount: function componentDidMount() {
    _middlewareShellMiddleware2["default"].spawnShell(this.props.shellType, this.createNewShell);
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (this.props.shellType !== prevProps.shellType) {
      this.ws.close();
      this.term.destroy();
      this.isAuthenticated = false;
      _middlewareShellMiddleware2["default"].spawnShell(this.props.shellType, this.createNewShell);
    }
    if (this.refs.termTarget.getDOMNode().clientHeight !== 0) {
      this.term.resize(80, this.refs.termTarget.getDOMNode().clientHeight * 0.05);
    }
  },

  createNewShell: function createNewShell(token) {
    var url = window.location.protocol === "https:" ? "wss://" : "ws://" + document.domain + ":5000/shell";

    this.ws = new WebSocket(url);
    this.term = new _termJs2["default"]({ cols: 80,
      rows: 14,
      screenKeys: true
    });

    this.ws.onopen = (function (event) {
      this.ws.send(JSON.stringify({ token: token }));
    }).bind(this);

    this.ws.onmessage = (function (event) {
      if (!this.isAuthenticated) {
        if (JSON.parse(event.data)["status"] === "ok") {
          this.isAuthenticated = true;
        }

        return;
      }

      this.term.write(event.data);
    }).bind(this);

    this.term.on("data", (function (data) {
      this.ws.send(data);
    }).bind(this));

    this.term.open(this.refs.termTarget.getDOMNode());
  },

  render: function render() {
    return _react2["default"].createElement("div", { className: "termFlex", ref: "termTarget" });
  }

});

module.exports = Shell;
//# sourceMappingURL=Shell.js.map