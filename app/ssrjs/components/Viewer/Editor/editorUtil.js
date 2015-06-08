// Editor Utilities
// ================
// A group of utility functions designed to make the creation of Editor/Viewer
// templates simpler and more straightforward.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _commonThrobber = require("../../common/Throbber");

var _commonThrobber2 = _interopRequireDefault(_commonThrobber);

var editorUtil = exports;

editorUtil.updateOverlay = _react2["default"].createClass({
  displayName: "updateOverlay",

  propTypes: {
    updateString: _react2["default"].PropTypes.string,
    throbberStyle: _react2["default"].PropTypes.string,
    animDuration: _react2["default"].PropTypes.number,
    animDelay: _react2["default"].PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      animDuration: 250,
      animDelay: 600
    };
  },

  getInitialState: function getInitialState() {
    return { animating: false };
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    // Using !! performs boolean type coercion
    var oldBool = !!prevProps.updateString;
    var newBool = !!this.props.updateString;

    // Functions as logical XOR to detect disparity between length states
    if (oldBool !== newBool) {
      this.updateOverlayVisibility(newBool);
    }
  },

  updateOverlayVisibility: function updateOverlayVisibility(newBool) {
    // If the new property had length, and the old one didn't (determined by
    // XOR), we know that we're going from nothing to soemthing, so we fadein.
    // The same holds true in the opposite case, causing a fadeout.
    if (newBool) {
      Velocity(this.refs["update-overlay"].getDOMNode(), "fadeIn", {
        duration: this.props.animDuration,
        display: "flex"
      });
    } else {
      Velocity(this.refs["update-overlay"].getDOMNode(), "fadeOut", {
        duration: this.props.animDuration,
        delay: this.props.animDelay
      });
    }

    this.setState({ animating: true });

    this.animTimeout = setTimeout((function () {
      this.setState({ animating: false });
    }).bind(this), this.props.animDuration + this.props.animDelay + 250);
  },

  render: function render() {
    var overlay = null;

    // Using !! performs boolean type coercion
    if (this.props.updateString.length || this.state.animating) {
      overlay = _react2["default"].createElement(
        "div",
        { className: "overlay overlay-light editor-update-overlay",
          ref: "update-overlay",
          style: { opacity: 0 } },
        _react2["default"].createElement(
          "div",
          null,
          _react2["default"].createElement(
            "h3",
            null,
            this.props.updateString || "Done."
          ),
          _react2["default"].createElement(_commonThrobber2["default"], { bsStyle: this.props.throbberStyle || "primary" })
        )
      );
    }

    return overlay;
  }

});
//# sourceMappingURL=editorUtil.js.map
