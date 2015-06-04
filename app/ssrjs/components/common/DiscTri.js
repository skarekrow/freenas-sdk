// Generic Disclosure Triangle based React Components
// ===============================
// General purpose disclosure Triangles, they can be used to show/hide any
// data(paragraphs/lists/Twitter Bootstrap panels (TWBS.panel) ,etc)

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

// Icons

var _Icon = require("../Icon");

var _Icon2 = _interopRequireDefault(_Icon);

var DiscTri = _react2["default"].createClass({
  displayName: "DiscTri",
  propTypes: { headerShow: _react2["default"].PropTypes.string,
    headerHide: _react2["default"].PropTypes.string,
    DiscShowImg: _react2["default"].PropTypes.node,
    DiscHideImg: _react2["default"].PropTypes.node,
    onDisc: _react2["default"].PropTypes.func,
    defaultExpanded: _react2["default"].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return { headerShow: "Hide",
      headerHide: "Show",
      DiscShowImg: _react2["default"].createElement(_Icon2["default"], { glyph: "toggle-down",
        icoSize: "1em" }),
      DiscHideImg: _react2["default"].createElement(_Icon2["default"], { glyph: "toggle-right",
        icoSize: "1em" })
    };
  },

  getInitialState: function getInitialState() {
    var defaultExpanded = this.props.defaultExpanded !== null ? this.props.defaultExpanded : this.props.expanded !== null ? this.props.expanded : false;

    return {
      expanded: defaultExpanded
    };
  },

  isExpanded: function isExpanded() {
    return this.state.expanded;
  },

  onHandleToggle: function onHandleToggle(e) {
    e.preventDefault();
    if (typeof this.props.onDisc === "function") {
      this.props.onDisc();
    }
    this.setState({ expanded: !this.state.expanded });
  },

  render: function render() {
    // TODO: change to classnames?
    var text = this.props.headerHide;
    var img = this.props.DiscHideImg;
    var cln = "disc-hide";
    if (this.isExpanded()) {
      text = this.props.headerShow;
      img = this.props.DiscShowImg;
      cln = "disc-show";
    }
    return _react2["default"].createElement(
      "div",
      { className: "disclosure-triangle" },
      _react2["default"].createElement(
        "div",
        { onClick: this.onHandleToggle,
          className: "disc-title" },
        img,
        text
      ),
      _react2["default"].createElement(
        "div",
        { className: cln },
        this.props.children
      )
    );
  }
});

module.exports = DiscTri;
//# sourceMappingURL=DiscTri.js.map