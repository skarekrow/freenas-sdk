

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _reactRouter = require("react-router");

var _mixinsViewerCommon = require("../mixins/viewerCommon");

var _mixinsViewerCommon2 = _interopRequireDefault(_mixinsViewerCommon);

var _viewerUtil = require("./viewerUtil");

var _viewerUtil2 = _interopRequireDefault(_viewerUtil);

var _commonToggleSwitch = require("../common/ToggleSwitch");

var _commonToggleSwitch2 = _interopRequireDefault(_commonToggleSwitch);

var DetailNavSection = _react2["default"].createClass({
  displayName: "DetailNavSection",

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  propTypes: {
    viewData: _react2["default"].PropTypes.object.isRequired,
    selectedItem: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.number, _react2["default"].PropTypes.string]),
    searchString: _react2["default"].PropTypes.string,
    activeKey: _react2["default"].PropTypes.string,
    sectionName: _react2["default"].PropTypes.string.isRequired,
    initialDisclosure: _react2["default"].PropTypes.string,
    disclosureThreshold: _react2["default"].PropTypes.number,
    entries: _react2["default"].PropTypes.array.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return { disclosureThreshold: 1 };
  },

  getInitialState: function getInitialState() {
    return { disclosure: this.props.initialDisclosure || "open" };
  },

  isUnderThreshold: function isUnderThreshold() {
    return this.props.entries.length <= this.props.disclosureThreshold;
  },

  createItem: function createItem(rawItem, index) {
    var searchString = this.props.searchString;
    var selectionValue = rawItem[this.props.viewData.format["selectionKey"]];
    var params = {};

    params[this.props.viewData.routing["param"]] = selectionValue;

    // FIXME: quick added || "" to the end of these so some searches wont bomb out when a key is null
    var primaryText = rawItem[this.props.viewData.format["primaryKey"]] || "";
    var secondaryText = rawItem[this.props.viewData.format["secondaryKey"]] || "";

    if (searchString.length) {
      primaryText = _viewerUtil2["default"].markSearch(primaryText, searchString);
      secondaryText = _viewerUtil2["default"].markSearch(secondaryText, searchString);
    }

    var ts = null;
    if (this.props.viewData.display.showToggleSwitch) {
      var serviceState = secondaryText === "running" ? true : false;
      ts = _react2["default"].createElement(_commonToggleSwitch2["default"], {
        toggled: serviceState,
        onChange: this.props.viewData.display.handleToggle.bind(null, rawItem) });
    }

    return _react2["default"].createElement(
      "li",
      { role: "presentation",
        key: index,
        className: "disclosure-target" },
      _react2["default"].createElement(
        _reactRouter.Link,
        { to: this.props.viewData.routing.route,
          params: params,
          onClick: this.props.handleItemSelect.bind(null, selectionValue) },
        _react2["default"].createElement(_viewerUtil2["default"].ItemIcon, { primaryString: rawItem[this.props.viewData.format["secondaryKey"]],
          fallbackString: rawItem[this.props.viewData.format["primaryKey"]],
          iconImage: rawItem[this.props.viewData.format["imageKey"]],
          fontIcon: rawItem[this.props.viewData.format["fontIconKey"]],
          seedNumber: rawItem[this.props.viewData.format["uniqueKey"]],
          fontSize: 1 }),
        _react2["default"].createElement(
          "div",
          { className: "viewer-detail-nav-item-text" },
          _react2["default"].createElement(
            "strong",
            { className: "primary-text" },
            primaryText
          ),
          _react2["default"].createElement(
            "small",
            { className: "secondary-text" },
            secondaryText
          )
        ),
        ts
      )
    );
  },

  toggleDisclosure: function toggleDisclosure() {
    var nextDisclosureState;

    if (this.state.disclosure === "open") {
      nextDisclosureState = "closed";
    } else {
      nextDisclosureState = "open";
    }

    this.setState({ disclosure: nextDisclosureState });
  },

  render: function render() {
    return _react2["default"].createElement(
      _reactBootstrap2["default"].Nav,
      { bsStyle: "pills",
        stacked: true,
        className: "disclosure-" + (this.isUnderThreshold() ? "default" : this.state.disclosure),
        activeKey: this.props.selectedKey },
      _react2["default"].createElement(
        "h5",
        { className: "viewer-detail-nav-group disclosure-toggle",
          onClick: this.toggleDisclosure },
        this.props.sectionName
      ),
      this.props.entries.map(this.createItem)
    );
  }

});

// Detail Viewer
var DetailViewer = _react2["default"].createClass({
  displayName: "DetailViewer",

  mixins: [_mixinsViewerCommon2["default"]],

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  propTypes: {
    viewData: _react2["default"].PropTypes.object.isRequired,
    handleItemSelect: _react2["default"].PropTypes.func.isRequired,
    selectedItem: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.number, _react2["default"].PropTypes.string]),
    searchString: _react2["default"].PropTypes.string,
    filteredData: _react2["default"].PropTypes.object.isRequired
  },

  componentDidMount: function componentDidMount() {
    // TODO: This will be an array once we implement multi-select
    var params = {};
    if (_lodash2["default"].isNumber(this.props.selectedItem) || _lodash2["default"].isString(this.props.selectedItem)) {
      params[this.props.viewData.routing["param"]] = this.props.selectedItem;
      this.context.router.replaceWith(this.props.viewData.routing.route, params);
    }
  },

  createAddEntityButton: function createAddEntityButton() {
    var addEntityButton;

    if (this.props.viewData.addEntity && this.props.viewData.routing.addentity) {
      addEntityButton = _react2["default"].createElement(
        _reactRouter.Link,
        { to: this.props.viewData.routing.addentity,
          className: "viewer-detail-add-entity" },
        _react2["default"].createElement(
          _reactBootstrap2["default"].Button,
          { bsStyle: "default",
            className: "viewer-detail-add-entity" },
          this.props.viewData.addEntity
        )
      );

      return addEntityButton;
    }
  }

  // Sidebar navigation for collection

  , render: function render() {
    var fd = this.props.filteredData;
    var groupedNavItems = null;
    var remainingNavItems = null;
    var editorContent = null;

    if (fd["grouped"]) {
      groupedNavItems = fd.groups.map((function (group, index) {
        var disclosureState;

        if (this.props.viewData.display.defaultCollapsed) {
          disclosureState = this.props.viewData.display.defaultCollapsed.indexOf(group.key) > -1 ? "closed" : "open";
        } else {
          disclosureState = "open";
        }

        if (group.entries.length) {
          return _react2["default"].createElement(DetailNavSection, {
            key: index,
            viewData: this.props.viewData,
            handleItemSelect: this.props.handleItemSelect,
            searchString: this.props.searchString,
            sectionName: group.name,
            initialDisclosure: disclosureState,
            entries: group.entries });
        } else {
          return null;
        }
      }).bind(this));
    }

    if (fd["remaining"].entries.length) {
      remainingNavItems = _react2["default"].createElement(DetailNavSection, {
        viewData: this.props.viewData,
        handleItemSelect: this.props.handleItemSelect,
        searchString: this.props.searchString,
        sectionName: fd["remaining"].name,
        initialDisclosure: "closed",
        entries: fd["remaining"].entries });
    }

    if (this.addingEntity()) {
      editorContent = _react2["default"].createElement(_reactRouter.RouteHandler, {
        viewData: this.props.viewData });
    } else if (this.dynamicPathIsActive()) {
      editorContent = _react2["default"].createElement(_reactRouter.RouteHandler, {
        viewData: this.props.viewData,
        inputData: this.props.inputData });
    } else {
      editorContent = _react2["default"].createElement(
        "div",
        { className: "viewer-item-info" },
        _react2["default"].createElement(
          "h3",
          { className: "viewer-item-no-selection" },
          "No active selection"
        )
      );
    }

    return _react2["default"].createElement(
      "div",
      { className: "viewer-detail" },
      _react2["default"].createElement(
        "div",
        { className: "viewer-detail-sidebar" },
        this.createAddEntityButton(),
        _react2["default"].createElement(
          "div",
          { className: "viewer-detail-nav well" },
          groupedNavItems,
          remainingNavItems
        )
      ),
      editorContent
    );
  }

});

module.exports = DetailViewer;
//# sourceMappingURL=DetailViewer.js.map
