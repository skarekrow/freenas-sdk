

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _Icon = require("./Icon");

var _Icon2 = _interopRequireDefault(_Icon);

var Widget = _react2["default"].createClass({
  displayName: "Widget",

  getInitialState: function getInitialState() {
    return { count: 0,
      sizeArr: ["s", "m", "l"],
      widgetContetnStyle: { width: this.props.dimensions[0],
        height: this.props.dimensions[1] - 16 }
    };
  },

  changeSize: function changeSize() {
    // console.log( "changeSize" );
    var i = this.state.count < this.state.sizeArr.length ? this.state.count : 0;
    // console.log( i );
    i++;
    // console.log( i );

    this.setState({ size: this.state.sizeArr[i - 1] + this.state.size.substring(1, this.state.size.length),
      count: i
    });
  },

  render: function render() {
    var widgetStyle = this.props.position ? { left: this.props.position[0],
      top: this.props.position[1] } : {};
    return _react2["default"].createElement(
      "div",
      { ref: this.props.refHolder,
        onMouseDown: this.props.onMouseDownHolder,
        className: "widget " + this.props.size + (this.props.inMotion ? " in-motion" : ""),
        style: widgetStyle },
      _react2["default"].createElement(
        "header",
        null,
        _react2["default"].createElement(
          "span",
          { className: "widgetTitle" },
          this.props.title,
          _react2["default"].createElement(_Icon2["default"], {
            glyph: "gear",
            icoSize: "lg",
            onTouchStart: this.changeSize,
            onClick: this.changeSize })
        )
      ),
      _react2["default"].createElement(
        "div",
        { className: "widget-content",
          style: this.state.widgetContetnStyle },
        this.props.children
      )
    );
  }
});

module.exports = Widget;
//# sourceMappingURL=Widget.js.map
