// Generic Confirmation Dialog Box
// ===============================
// General purpose confirmation dialog, it can be used by any view/button that
// should require a confirmation
// (Yes/No/Close etc.) before the actual thing happening
// TODO: Give it a .less file for giving it custom themes

"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

// Twitter Bootstrap React Components

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var ConfDialog = _react2["default"].createClass({
  displayName: "ConfDialog",
  propTypes: { bsStyle: _react2["default"].PropTypes.oneOf(["primary", "info", "danger", "warning", "success"]),
    modalTitle: _react2["default"].PropTypes.string,
    bodyText: _react2["default"].PropTypes.string,
    footerLeftBtn: _react2["default"].PropTypes.string,
    footerRightBtn: _react2["default"].PropTypes.string,
    modalAnimation: _react2["default"].PropTypes.bool,
    className: _react2["default"].PropTypes.string,
    callFunc: _react2["default"].PropTypes.func.isRequired,
    dataText: _react2["default"].PropTypes.node.isRequired
  },

  mixins: [_reactBootstrap2["default"].OverlayMixin],

  getDefaultProps: function getDefaultProps() {
    return { bsStyle: "primary",
      title: "Confirmation",
      animation: false,
      className: "",
      bodyText: "Are you sure you want to perform this Action?",
      footerLeftBtn: "Cancel",
      footerRightBtn: "Yes"
    };
  },

  getInitialState: function getInitialState() {
    return {
      isModalOpen: false
    };
  },

  handleToggle: function handleToggle() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  // TODO: Make the this.props.dataText's onClick function
  // more elegant.
  , render: function render() {
    return _react2["default"].createElement(
      "span",
      { onClick: this.handleToggle },
      this.props.dataText
    );
  },

  saveClick: function saveClick() {
    this.props.callFunc();
    this.handleToggle();
  },

  renderOverlay: function renderOverlay() {
    if (!this.state.isModalOpen) {
      return _react2["default"].createElement("span", null);
    }

    return _react2["default"].createElement(
      _reactBootstrap2["default"].Modal,
      _extends({}, this.props, { onRequestHide: this.handleToggle }),
      _react2["default"].createElement(
        "div",
        { className: "modal-body" },
        _react2["default"].createElement(
          "h4",
          null,
          this.props.bodyText
        )
      ),
      _react2["default"].createElement(
        "div",
        { className: "modal-footer" },
        _react2["default"].createElement(
          _reactBootstrap2["default"].Button,
          { onClick: this.handleToggle },
          this.props.footerLeftBtn
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Button,
          { bsStyle: "primary", onClick: this.saveClick },
          this.props.footerRightBtn
        )
      )
    );
  }
});

module.exports = ConfDialog;
//# sourceMappingURL=ConfDialog.js.map