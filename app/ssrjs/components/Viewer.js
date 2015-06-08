// VIEWER
// ======
// One of the primary display components in FreeNAS. The Viewer is capable of
// ingesting data sets or collections of "like" things, and displaying them in
// a variety of modes. It is similar in this way to a desktop client's browser
// window, though not limited to just displaying files.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _mixinsViewerCommon = require("./mixins/viewerCommon");

var _mixinsViewerCommon2 = _interopRequireDefault(_mixinsViewerCommon);

var _Icon = require("./Icon");

var _Icon2 = _interopRequireDefault(_Icon);

var _ViewerDetailViewer = require("./Viewer/DetailViewer");

var _ViewerDetailViewer2 = _interopRequireDefault(_ViewerDetailViewer);

var _ViewerIconViewer = require("./Viewer/IconViewer");

var _ViewerIconViewer2 = _interopRequireDefault(_ViewerIconViewer);

var _ViewerTableViewer = require("./Viewer/TableViewer");

var _ViewerTableViewer2 = _interopRequireDefault(_ViewerTableViewer);

// Main Viewer Wrapper Component
var Viewer = _react2["default"].createClass({
  displayName: "Viewer",
  mixins: [_mixinsViewerCommon2["default"]],

  contextTypes: { router: _react2["default"].PropTypes.func },

  propTypes: { defaultMode: _react2["default"].PropTypes.string,
    allowedModes: _react2["default"].PropTypes.array,
    inputData: _react2["default"].PropTypes.array.isRequired,
    viewData: _react2["default"].PropTypes.object.isRequired,
    displayData: _react2["default"].PropTypes.object
  }

  // REACT LIFECYCLE
  , getDefaultProps: function getDefaultProps() {
    // Viewer allows all modes by default, except for heirarchical. This list
    // can be overwritten by passing allowedModes into your <Viewer />.
    // Allowed modes are:
    // "detail" : Items on left, with properties on right, cnofigurable
    // "icon"   : Items as icons, with properties as modal
    // "table"  : Items as table rows, showing more data
    // TODO: "heir"   : Heirarchical view, shows relationships between items
    return { allowedModes: ["detail", "icon", "table"] };
  },

  getInitialState: function getInitialState() {
    var VIEWDATA = this.props.viewData;
    // render will always use currentMode - in an uninitialized Viewer, the
    // mode will not have been set, and should therefore come from either a
    // passed in currentMode or defaultMode, falling back to getDefaultProps
    var INITIALMODE = this.props.currentMode || this.props.defaultMode || "detail";

    // Generate an array of keys which TableViewer can use to quickly generate
    // its internal structure by looping through the returned data from the
    // middleware and creating cells. Also useful for getting human-friendly
    // names out of the translation key.
    var defaultTableCols = [];
    var currentParams = this.context.router.getCurrentParams();
    var selectedItem = currentParams[VIEWDATA.routing["param"]];

    _lodash2["default"].filter(VIEWDATA.format.dataKeys, function (item, key, collection) {
      if (item["defaultCol"]) {
        defaultTableCols.push(item["key"]);
      }
    });

    if (!_lodash2["default"].isNumber(selectedItem) && !_lodash2["default"].isString(selectedItem)) {
      selectedItem = null;
    }

    return { currentMode: this.changeViewerMode(INITIALMODE),
      tableCols: defaultTableCols,
      enabledGroups: VIEWDATA.display.defaultGroups.length ? VIEWDATA.display.defaultGroups : null,
      enabledFilters: VIEWDATA.display.defaultFilters.length ? VIEWDATA.display.defaultFilters : null,
      filteredData: { grouped: false,
        groups: [],
        remaining: { entries: [] }
      },
      searchString: "",
      selectedItem: selectedItem
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.processDisplayData({ inputData: nextProps.inputData });
  }

  // VIEWER DATA HANDLING

  // processDisplayData applys filters, searches, and then groups before
  // handing the data to any of its sub-views. The structure is deliberately
  // generic so that any sub-view may display the resulting data as it
  // sees fit.
  , processDisplayData: function processDisplayData(options) {
    var VIEWDATA = this.props.viewData;

    var displayParams = { inputData: this.props.inputData,
      searchString: this.state.searchString,
      enabledGroups: this.state.enabledGroups,
      enabledFilters: this.state.enabledFilters
    };

    _lodash2["default"].assign(displayParams, options);

    // Prevent function from modifying nextProps
    var inputDataArray = _lodash2["default"].cloneDeep(displayParams.inputData);
    var filteredData = { grouped: false,
      groups: [],
      remaining: {},
      rawList: []
    };

    // Reduce the array by applying exclusion filters (defined in the view)
    // TODO: Debug this - doesn't work right!
    if (displayParams.enabledFilters) {
      displayParams.enabledFilters.map((function (filter) {
        _lodash2["default"].remove(inputDataArray, VIEWDATA.display.filterCriteria[filter].testProp);
      }).bind(this));
    }

    // Reduce the array to only items which contain a substring match for the
    // searchString in either their primary or secondary keys
    inputDataArray = _lodash2["default"].filter(inputDataArray, function (item) {
      // TODO: Are keys always strings? May want to rethink this
      var searchString = displayParams.searchString.toLowerCase();

      var searchTarget = item[VIEWDATA.format.primaryKey] + item[VIEWDATA.format.secondaryKey] || "";

      return _lodash2["default"].includes(searchTarget.toLowerCase(), searchString);
    });

    // At this point, inputDataArray is an ungrouped (but filtered) list of
    // items, useful for views like the table.
    filteredData["rawList"] = _lodash2["default"].clone(inputDataArray);

    // Convert array into object based on groups
    if (displayParams.enabledGroups.length) {
      displayParams.enabledGroups.map(function (group) {
        var groupData = VIEWDATA.display.filterCriteria[group];
        var newEntries = _lodash2["default"].remove(inputDataArray, groupData.testProp);

        filteredData.groups.push({ name: groupData.name,
          key: group,
          entries: newEntries
        });
      });

      filteredData["grouped"] = true;
    } else {
      filteredData["grouped"] = false;
    }

    // All remaining items are put in the "remaining" property
    filteredData["remaining"] = { name: filteredData["grouped"] ? VIEWDATA.display["remainingName"] : VIEWDATA.display["ungroupedName"],
      entries: inputDataArray
    };

    this.setState({ filteredData: filteredData,
      searchString: displayParams.searchString,
      enabledGroups: displayParams.enabledGroups,
      enabledFilters: displayParams.enabledFilters
    });
  },

  handleItemSelect: function handleItemSelect(selectionValue, event) {
    var newSelection = null;

    if (!_lodash2["default"].isNumber(selectionValue) || !_lodash2["default"].isString(selectionValue)) {
      newSelection = selectionValue;
    }

    this.setState({ selectedItem: newSelection });
  },

  handleSearchChange: function handleSearchChange(event) {
    this.processDisplayData({ searchString: event.target.value });
  },

  changeViewerMode: function changeViewerMode(targetMode) {
    var newMode = undefined;

    // See if a disallowed mode has been requested
    if (_lodash2["default"].includes(this.props.allowedModes, targetMode)) {
      newMode = targetMode;
    } else {
      if (this.props.defaultMode) {
        // Use the default mode, if provided
        newMode = this.props.defaultMode;
      } else {
        // If no default, use the first allowed mode in the list
        newMode = this.props.allowedModes[0];
      }
    }

    // When changing viewer modes, close any previously open items.
    // TODO: This may need to change with single-click select functionality.
    this.returnToViewerRoot();

    return newMode;
  },

  handleModeSelect: function handleModeSelect(selectedKey, foo, bar) {
    this.setState({ currentMode: this.changeViewerMode(selectedKey) });
  },

  changeTargetItem: function changeTargetItem(params) {
    // Returns the first object from the input array whose selectionKey
    // matches the current route's dynamic portion. For instance,
    // "/accounts/users/root" with "bsdusr_usrname" as the selectionKey would
    // match the first object in inputData whose username === "root"
    return _lodash2["default"].find(this.props.inputData, (function (item) {
      return params[this.props.viewData.routing["param"]] === item[this.props.viewData.format["selectionKey"]];
    }).bind(this));
  }

  // VIEWER DISPLAY
  , createModeNav: function createModeNav(mode, index) {
    var modeIcons = { detail: "th-list",
      icon: "th",
      table: "align-justify",
      heir: "bell"
    };

    return _react2["default"].createElement(
      _reactBootstrap2["default"].Button,
      {
        onClick: this.handleModeSelect.bind(this, mode),
        key: index,
        bsStyle: mode === this.state.currentMode ? "info" : "default",
        active: false },
      _react2["default"].createElement(_Icon2["default"], { glyph: modeIcons[mode] })
    );
  },

  createViewerContent: function createViewerContent() {
    var ViewerContent = null;

    switch (this.state.currentMode) {
      default:
      case "detail":
        ViewerContent = _ViewerDetailViewer2["default"];
        break;

      case "icon":
        ViewerContent = _ViewerIconViewer2["default"];
        break;

      case "table":
        ViewerContent = _ViewerTableViewer2["default"];
        break;

      case "heir":
        // TODO: Heirarchical Viewer
        break;
    }

    return _react2["default"].createElement(ViewerContent, {
      viewData: this.props.viewData,
      inputData: this.props.inputData,
      tableCols: this.state.tableCols,
      handleItemSelect: this.handleItemSelect,
      selectedItem: this.state.selectedItem,
      searchString: this.state.searchString,
      filteredData: this.state.filteredData });
  },

  render: function render() {
    var viewerModeNav = null;

    // Create navigation mode icons
    if (this.props.allowedModes.length > 1) {
      viewerModeNav = _react2["default"].createElement(
        _reactBootstrap2["default"].ButtonGroup,
        {
          className: "navbar-btn navbar-right",
          activeMode: this.state.currentMode },
        this.props.allowedModes.map(this.createModeNav)
      );
    }

    return _react2["default"].createElement(
      "div",
      { className: "viewer" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Navbar,
        { fluid: true, className: "viewer-nav" },
        _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
          placeholder: "Search",
          value: this.state.searchString,
          groupClassName: "navbar-form navbar-left",
          onChange: this.handleSearchChange,
          addonBefore: _react2["default"].createElement(_Icon2["default"], { glyph: "search" }) }),
        viewerModeNav
      ),
      this.createViewerContent()
    );
  }

});

exports["default"] = Viewer;
module.exports = exports["default"];
/* Searchbox for Viewer (1) */ /* Select view mode (3) */
//# sourceMappingURL=Viewer.js.map
