

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _Icon = require("../Icon");

var _Icon2 = _interopRequireDefault(_Icon);

var _mixinsViewerCommon = require("../mixins/viewerCommon");

var _mixinsViewerCommon2 = _interopRequireDefault(_mixinsViewerCommon);

var _viewerUtil = require("./viewerUtil");

var _viewerUtil2 = _interopRequireDefault(_viewerUtil);

var _commonToggleSwitch = require("../common/ToggleSwitch");

var _commonToggleSwitch2 = _interopRequireDefault(_commonToggleSwitch);

// Icon Viewer
var IconViewer = _react2["default"].createClass({
  displayName: "IconViewer",

  mixins: [_mixinsViewerCommon2["default"]],

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  propTypes: {
    viewData: _react2["default"].PropTypes.object.isRequired,
    inputData: _react2["default"].PropTypes.array.isRequired,
    handleItemSelect: _react2["default"].PropTypes.func.isRequired,
    selectedItem: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.number, _react2["default"].PropTypes.string]),
    searchString: _react2["default"].PropTypes.string,
    filteredData: _react2["default"].PropTypes.object.isRequired
  },

  componentDidMount: function componentDidMount() {
    window.addEventListener("keyup", this.handleEscClose);
  },

  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscClose);
  },

  handleEscClose: function handleEscClose(event) {
    if (event.which === 27 && this.dynamicPathIsActive()) {
      event.preventDefault();
      event.stopPropagation();
      this.returnToViewerRoot();
    }
  },

  handleClickOut: function handleClickOut(event, componentID) {
    if (event.dispatchMarker === componentID) {
      this.returnToViewerRoot();
    }
  },

  handleItemClick: function handleItemClick(params, selectionValue, event) {
    switch (event.type) {
      case "click":
        this.props.handleItemSelect(selectionValue);
        break;

      case "dblclick":
        this.context.router.transitionTo(this.props.viewData.routing.route, params);
        break;
    }
  },

  createItem: function createItem(rawItem) {
    var searchString = this.props.searchString;
    var selectionValue = rawItem[this.props.viewData.format["selectionKey"]];
    var params = {};

    params[this.props.viewData.routing["param"]] = selectionValue;

    var primaryText = rawItem[this.props.viewData.format["primaryKey"]];
    var secondaryText = rawItem[this.props.viewData.format["secondaryKey"]];

    if (searchString.length) {
      primaryText = _viewerUtil2["default"].markSearch(primaryText.split(searchString), searchString);
      secondaryText = _viewerUtil2["default"].markSearch(secondaryText.split(searchString), searchString);
    }

    var ts = null;
    if (this.props.viewData.display.showToggleSwitch) {
      var serviceState = secondaryText === "running" ? true : false;
      ts = _react2["default"].createElement(_commonToggleSwitch2["default"], {
        toggled: serviceState,
        onChange: this.props.viewData.display.handleToggle.bind(null, rawItem) });
    }

    return _react2["default"].createElement(
      "div",
      {
        className: "viewer-icon-item" + (selectionValue === this.props.selectedItem ? " active" : ""),
        onClick: this.handleItemClick.bind(null, null, selectionValue),
        onDoubleClick: this.handleItemClick.bind(null, params, selectionValue) },
      _react2["default"].createElement(_viewerUtil2["default"].ItemIcon, { primaryString: rawItem[this.props.viewData.format["secondaryKey"]],
        fallbackString: rawItem[this.props.viewData.format["primaryKey"]],
        iconImage: rawItem[this.props.viewData.format["imageKey"]],
        fontIcon: rawItem[this.props.viewData.format["fontIconKey"]],
        seedNumber: rawItem[this.props.viewData.format["uniqueKey"]],
        fontSize: 1 }),
      _react2["default"].createElement(
        "div",
        { className: "viewer-icon-item-text" },
        _react2["default"].createElement(
          "h6",
          { className: "viewer-icon-item-primary" },
          primaryText
        ),
        _react2["default"].createElement(
          "small",
          { className: "viewer-icon-item-secondary" },
          secondaryText
        ),
        ts
      )
    );
  },

  render: function render() {
    var fd = this.props.filteredData;
    var editorContent = null;
    var groupedIconItems = null;
    var remainingIconItems = null;

    if (this.dynamicPathIsActive()) {
      editorContent = _react2["default"].createElement(
        "div",
        { className: "overlay-light editor-edit-overlay",
          onClick: this.handleClickOut },
        _react2["default"].createElement(
          "div",
          { className: "editor-edit-wrapper" },
          _react2["default"].createElement(
            "span",
            { className: "clearfix" },
            _react2["default"].createElement(_Icon2["default"], {
              glyph: "close",
              icoClass: "editor-close",
              onClick: this.handleClickOut })
          ),
          _react2["default"].createElement(_reactRouter.RouteHandler, {
            viewData: this.props.viewData,
            inputData: this.props.inputData,
            activeKey: this.props.selectedKey })
        )
      );
    }

    if (fd["grouped"]) {
      groupedIconItems = fd.groups.map((function (group, index) {
        if (group.entries.length) {
          return _react2["default"].createElement(
            "div",
            { className: "viewer-icon-section", key: index },
            _react2["default"].createElement(
              "h4",
              null,
              group.name
            ),
            _react2["default"].createElement("hr", null),
            group.entries.map(this.createItem)
          );
        } else {
          return null;
        }
      }).bind(this));
    }

    if (fd["remaining"].entries.length) {
      remainingIconItems = _react2["default"].createElement(
        "div",
        { className: "viewer-icon-section" },
        _react2["default"].createElement(
          "h4",
          null,
          fd["remaining"].name
        ),
        _react2["default"].createElement("hr", null),
        fd["remaining"].entries.map(this.createItem)
      );
    }

    return _react2["default"].createElement(
      "div",
      { className: "viewer-icon" },
      editorContent,
      groupedIconItems,
      remainingIconItems
    );
  }
});

module.exports = IconViewer;
//# sourceMappingURL=IconViewer.js.map
