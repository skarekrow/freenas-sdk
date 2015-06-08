// Add Group Template
// ==================
// Handles the process of adding a new group.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _storesGroupsStore = require("../../../stores/GroupsStore");

var _storesGroupsStore2 = _interopRequireDefault(_storesGroupsStore);

var _middlewareGroupsMiddleware = require("../../../middleware/GroupsMiddleware");

var _middlewareGroupsMiddleware2 = _interopRequireDefault(_middlewareGroupsMiddleware);

var _componentsMixinsInputHelpers = require("../../../components/mixins/inputHelpers");

var _componentsMixinsInputHelpers2 = _interopRequireDefault(_componentsMixinsInputHelpers);

var _componentsMixinsGroupMixins = require("../../../components/mixins/groupMixins");

var _componentsMixinsGroupMixins2 = _interopRequireDefault(_componentsMixinsGroupMixins);

var AddGroup = _react2["default"].createClass({
  displayName: "AddGroup",

  mixins: [_componentsMixinsInputHelpers2["default"], _componentsMixinsGroupMixins2["default"]],

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  propTypes: {
    viewData: _react2["default"].PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {

    var groupsList = _storesGroupsStore2["default"].getAllGroups();

    return {
      locallyModifiedValues: {},
      dataKeys: this.props.viewData.format.dataKeys,
      groupsList: groupsList
    };
  },

  handleValueChange: function handleValueChange(key, event) {
    var value = this.refs[key].getValue();
    var newLocallyModified = this.state.locallyModifiedValues;

    var dataKey = _lodash2["default"].find(this.state.dataKeys, function (dataKey) {
      return dataKey.key === key;
    });

    newLocallyModified[key] = this.processFormInput(event, value, dataKey);

    this.setState({ locallyModifiedValues: newLocallyModified });
  },

  submitNewGroup: function submitNewGroup() {
    var routing = this.props.viewData.routing;
    var newGroupValues = {};
    var params = {};

    // Stage values for submission. Read-only values are not allowed.
    newGroupValues = this.removeReadOnlyFields(this.state.locallyModifiedValues, this.state.dataKeys);

    // Set up to forward the view to the created group.
    params[routing["param"]] = newGroupValues["name"];

    // Submit the new group and redirect the view to it.
    // TODO: Does this need additional input validation?
    // TODO: Only redirect if the group was actually created.
    _middlewareGroupsMiddleware2["default"].createGroup(newGroupValues, this.context.router.transitionTo(routing["route"], params));
  }

  // TODO: There is probably room to genericize this into a mixin.
  , cancel: function cancel() {
    this.context.router.transitionTo("groups");
  },

  render: function render() {
    var addButtons = _react2["default"].createElement(
      _reactBootstrap2["default"].ButtonToolbar,
      null,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-right",
          onClick: this.cancel,
          bsStyle: "default" },
        "Cancel"
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-right",
          disabled: _lodash2["default"].isEmpty(this.state.locallyModifiedValues),
          onClick: this.submitNewGroup,
          bsStyle: "info" },
        "Save New Group"
      )
    );

    var inputFields = _react2["default"].createElement(
      "form",
      { className: "form-horizontal" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Grid,
        { fluid: true },
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 4 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              label: "Group ID",
              ref: "id",
              value: this.state.locallyModifiedValues["id"] ? this.state.locallyModifiedValues["id"] : this.getNextGID(),
              onChange: this.handleValueChange.bind(null, "id"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "id") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["id"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" })
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 8 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              label: "Group Name",
              ref: "name",
              value: this.state.locallyModifiedValues["name"] ? this.state.locallyModifiedValues["name"] : null,
              onChange: this.handleValueChange.bind(null, "name"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "name") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["name"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8",
              required: true })
          )
        )
      )
    );

    return _react2["default"].createElement(
      "div",
      { className: "viewer-item-info" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Grid,
        { fluid: true },
        addButtons,
        inputFields
      )
    );
  }
});

exports["default"] = AddGroup;
module.exports = exports["default"];
/* Group id */ /* username */
//# sourceMappingURL=AddGroup.js.map
