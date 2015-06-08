// Terminal Tab
// ============

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _middlewareShellMiddleware = require("../../middleware/ShellMiddleware");

var _middlewareShellMiddleware2 = _interopRequireDefault(_middlewareShellMiddleware);

var _commonShell = require("../common/Shell");

var _commonShell2 = _interopRequireDefault(_commonShell);

var Terminal = _react2["default"].createClass({
  displayName: "Terminal",

  getInitialState: function getInitialState() {
    return {
      currentShell: "/bin/sh",
      shells: []
    };
  },

  componentDidMount: function componentDidMount() {
    _middlewareShellMiddleware2["default"].requestAvailableShells((function (shells) {
      this.setState({ shells: shells });
    }).bind(this));
  },

  handleShellSelect: function handleShellSelect(shell) {
    this.setState({ currentShell: shell });
  },

  createShellMenuItem: function createShellMenuItem(shell, index) {
    return _react2["default"].createElement(
      _reactBootstrap2["default"].MenuItem,
      {
        onClick: this.handleShellSelect.bind(null, shell),
        key: index },
      shell
    );
  },

  render: function render() {
    return _react2["default"].createElement(
      "div",
      { className: "debug-content-flex-wrapper" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "FreeNAS Shell: " + this.state.currentShell
        ),
        _react2["default"].createElement(_commonShell2["default"], { shellType: this.state.currentShell })
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "div",
          { className: "debug-column-content" },
          _react2["default"].createElement(
            "h5",
            { className: "debug-heading" },
            "Terminal Options"
          ),
          _react2["default"].createElement(
            "div",
            null,
            _react2["default"].createElement(
              "label",
              { style: { marginRight: "10px" } },
              "Shell Type:"
            ),
            _react2["default"].createElement(
              _reactBootstrap2["default"].DropdownButton,
              { bsStyle: "default", title: this.state.currentShell },
              this.state.shells.map(this.createShellMenuItem)
            )
          ),
          _react2["default"].createElement("hr", null),
          _react2["default"].createElement(
            "h5",
            { className: "debug-heading" },
            "Term.js Instructions"
          ),
          _react2["default"].createElement(
            "p",
            null,
            "While term.js has always supported copy/paste using the mouse, it now also supports several keyboard based solutions for copy/paste."
          ),
          _react2["default"].createElement(
            "p",
            null,
            "term.js includes a tmux-like selection mode which makes copy and paste very simple. ",
            _react2["default"].createElement(
              "code",
              null,
              "Ctrl-A"
            ),
            " enters ",
            _react2["default"].createElement(
              "code",
              null,
              "prefix"
            ),
            " mode, from here you can type ",
            _react2["default"].createElement(
              "code",
              null,
              "Ctrl-V"
            ),
            " to paste. Press ",
            _react2["default"].createElement(
              "code",
              null,
              "["
            ),
            " in prefix mode to enter selection mode. To select text press ",
            _react2["default"].createElement(
              "code",
              null,
              "v"
            ),
            " (or ",
            _react2["default"].createElement(
              "code",
              null,
              "space"
            ),
            ") to enter visual mode, use ",
            _react2["default"].createElement(
              "code",
              null,
              "hjkl"
            ),
            " to navigate and create a selection, and press ",
            _react2["default"].createElement(
              "code",
              null,
              "Ctrl-C"
            ),
            " to copy."
          ),
          _react2["default"].createElement(
            "p",
            null,
            _react2["default"].createElement(
              "code",
              null,
              "Ctrl-C"
            ),
            " (in visual mode) and ",
            _react2["default"].createElement(
              "code",
              null,
              "Ctrl-V"
            ),
            " (in prefix mode) should work in any OS for copy and paste. ",
            _react2["default"].createElement(
              "code",
              null,
              "y"
            ),
            " (in visual mode) will work for copying only on X11 systems. It will copy to the primary selection."
          ),
          _react2["default"].createElement(
            "p",
            null,
            "Note: ",
            _react2["default"].createElement(
              "code",
              null,
              "Ctrl-C"
            ),
            " will also work in prefix mode for the regular OS/browser selection. If you want to select text with your mouse and copy it to the clipboard, simply select the text and type ",
            _react2["default"].createElement(
              "code",
              null,
              "Ctrl-A + Ctrl-C"
            ),
            ", and ",
            _react2["default"].createElement(
              "code",
              null,
              "Ctrl-A + Ctrl-V"
            ),
            " to paste it."
          ),
          _react2["default"].createElement(
            "p",
            null,
            "For Mac users: Consider ",
            _react2["default"].createElement(
              "code",
              null,
              "Ctrl"
            ),
            " to be ",
            _react2["default"].createElement(
              "code",
              null,
              "Command/Apple"
            ),
            " above."
          )
        )
      )
    );
  }

});

module.exports = Terminal;
//# sourceMappingURL=Terminal.js.map
