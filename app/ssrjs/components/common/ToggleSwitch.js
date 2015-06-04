// TOGGLE SWITCH
// =============
// A simple boolean toggle switch that performs the same functionality as a
// checkbox.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var ToggleSwitch = _react2["default"].createClass({
  displayName: "ToggleSwitch",
  propTypes: { toggled: _react2["default"].PropTypes.bool,
    onChange: _react2["default"].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return { toggled: false,
      onChange: function onChange(toggleState, reactID) {
        console.warn("No onChange handler was provided for" + " ToggleSwitch", reactID);
      }
    };
  },

  handleToggleClick: function handleToggleClick(event, reactID) {
    event.stopPropagation();
    event.preventDefault();

    this.props.onChange(!this.props.toggled, reactID);
  },

  render: function render() {
    var toggleClasses = ["toggle-switch"];

    if (this.props.toggled) {
      toggleClasses.push("on");
    }

    if (this.props.sm || this.props.small) {
      toggleClasses.push("toggle-switch-sm");
    }

    return _react2["default"].createElement("div", {
      className: toggleClasses.join(" "),
      onClick: this.handleToggleClick });
  }

});

module.exports = ToggleSwitch;
//# sourceMappingURL=ToggleSwitch.js.map