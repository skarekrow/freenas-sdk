

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _reactRouter = require("react-router");

var _Icon = require("../Icon");

var _Icon2 = _interopRequireDefault(_Icon);

var _mixinsViewerCommon = require("../mixins/viewerCommon");

var _mixinsViewerCommon2 = _interopRequireDefault(_mixinsViewerCommon);

var _viewerUtil = require("./viewerUtil");

var _viewerUtil2 = _interopRequireDefault(_viewerUtil);

// Table Viewer
var TableViewer = _react2["default"].createClass({
  displayName: "TableViewer",

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
    filteredData: _react2["default"].PropTypes.object.isRequired,
    tableCols: _react2["default"].PropTypes.array.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      tableColWidths: this.getInitialColWidths(this.props.tableCols),
      tableColOrder: this.props.tableCols,
      sortTableBy: null,
      sortOrder: "none"
    };
  },

  componentDidMount: function componentDidMount() {
    this.setState({ tableColWidths: this.getUpdatedColWidths(this.state.tableColOrder) });
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

  handleRowClick: function handleRowClick(params, selectionValue, event, componentID) {
    switch (event.type) {
      case "click":
        this.props.handleItemSelect(selectionValue);
        break;

      case "dblclick":
        this.context.router.transitionTo(this.props.viewData.routing.route, params);
        break;
    }
  },

  changeSortState: function changeSortState(key, event) {
    var nextSortTableBy = key;
    var nextSortOrder;

    // When the next key matches the current selection, change the sort order
    if (this.state.sortTableBy === key) {
      switch (this.state.sortOrder) {
        case "none":
          nextSortOrder = "descending";
          break;

        case "descending":
          nextSortOrder = "ascending";
          break;

        // If the user has clicked three times on the same header, clear the
        // sort and "reset" the view
        case "ascending":
          nextSortTableBy = null;
          nextSortOrder = "none";
          break;
      }
    } else {
      nextSortOrder = "descending";
    }

    this.setState({
      sortTableBy: nextSortTableBy,
      sortOrder: nextSortOrder
    });
  },

  getInitialColWidths: function getInitialColWidths(colArray) {
    var tempWidths = {};

    colArray.map(function (targetCol, index) {
      tempWidths[targetCol] = "auto";
    });

    return tempWidths;
  },

  getUpdatedColWidths: function getUpdatedColWidths(colArray) {
    var tempWidths = {};
    var viewerRefs = this.refs;
    var viewerWidth = this.refs["TABLE_VIEWER"].getDOMNode().offsetWidth;

    colArray.map(function (targetCol, index) {
      var colWidth = viewerRefs["COL_" + targetCol].getDOMNode().offsetWidth;
      tempWidths[targetCol] = Math.round(colWidth / viewerWidth * 10000) / 100 + "%";
    });

    return tempWidths;
  },

  createHeader: function createHeader(key, index) {
    var thIsActive = this.state.sortTableBy === key;
    var targetEntry = _lodash2["default"].where(this.props.viewData.format["dataKeys"], { "key": key })[0];
    return _react2["default"].createElement(
      "th",
      { className: "fixed-table-header-th",
        ref: "COL_" + key,
        style: { width: this.state.tableColWidths[key] },
        key: index },
      _react2["default"].createElement(
        "span",
        { className: "th-spacing" },
        targetEntry["name"]
      ),
      _react2["default"].createElement(
        "div",
        { className: "th-content sortable-table-th" + (thIsActive ? " " + this.state.sortOrder : ""),
          onClick: this.changeSortState.bind(null, key) },
        targetEntry["name"]
      )
    );
  },

  createRows: function createRows(item, index) {
    var selectionValue = item[this.props.viewData.format["selectionKey"]];
    var params = {};

    params[this.props.viewData.routing["param"]] = selectionValue;

    return _react2["default"].createElement(
      "tr",
      {
        key: index,
        className: this.props.selectedItem === selectionValue ? "active" : "",
        onClick: this.handleRowClick.bind(null, null, selectionValue),
        onDoubleClick: this.handleRowClick.bind(null, params, selectionValue) },
      this.props.tableCols.map(function (key, index) {
        return _react2["default"].createElement(
          "td",
          { key: index },
          _viewerUtil2["default"].identifyAndWrite(item[key])
        );
      })
    );
  },

  render: function render() {

    var tableData = null;
    var editorContent = null;

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

    if (this.state.sortTableBy) {
      tableData = _lodash2["default"].sortBy(this.props.filteredData["rawList"], this.state.sortTableBy);

      if (this.state.sortOrder === "ascending") {
        tableData = tableData.reverse();
      }
    } else {
      tableData = this.props.filteredData["rawList"];
    }

    return _react2["default"].createElement(
      "div",
      { className: "viewer-table fixed-table-container" },
      editorContent,
      _react2["default"].createElement(
        "div",
        { className: "fixed-table-container-inner" },
        _react2["default"].createElement(
          _reactBootstrap2["default"].Table,
          { striped: true, bordered: true, condensed: true, hover: true,
            ref: "TABLE_VIEWER",
            className: "fixed-table" },
          _react2["default"].createElement(
            "thead",
            null,
            _react2["default"].createElement(
              "tr",
              null,
              this.props.tableCols.map(this.createHeader)
            )
          ),
          _react2["default"].createElement(
            "tbody",
            null,
            tableData.map(this.createRows)
          )
        )
      )
    );
  }

});

module.exports = TableViewer;
//# sourceMappingURL=TableViewer.js.map