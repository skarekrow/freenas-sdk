// Group Item Template
// ==================
// Handles the viewing and editing of individual group items. Shows a non-editable
// overview of the group, and mode-switches to a more standard editor panel.
// Group is set by providing a route parameter.

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

var _componentsMixinsRouterShim = require("../../../components/mixins/routerShim");

var _componentsMixinsRouterShim2 = _interopRequireDefault(_componentsMixinsRouterShim);

var _componentsMixinsClientStatus = require("../../../components/mixins/clientStatus");

var _componentsMixinsClientStatus2 = _interopRequireDefault(_componentsMixinsClientStatus);

var _componentsViewerViewerUtil = require("../../../components/Viewer/viewerUtil");

var _componentsViewerViewerUtil2 = _interopRequireDefault(_componentsViewerViewerUtil);

var _componentsViewerEditorEditorUtil = require("../../../components/Viewer/Editor/editorUtil");

var _componentsViewerEditorEditorUtil2 = _interopRequireDefault(_componentsViewerEditorEditorUtil);

var _middlewareGroupsMiddleware = require("../../../middleware/GroupsMiddleware");

var _middlewareGroupsMiddleware2 = _interopRequireDefault(_middlewareGroupsMiddleware);

var _storesGroupsStore = require("../../../stores/GroupsStore");

var _storesGroupsStore2 = _interopRequireDefault(_storesGroupsStore);

var _storesUsersStore = require("../../../stores/UsersStore");

var _storesUsersStore2 = _interopRequireDefault(_storesUsersStore);

var _componentsMixinsGroupMixins = require("../../../components/mixins/groupMixins");

var _componentsMixinsGroupMixins2 = _interopRequireDefault(_componentsMixinsGroupMixins);

var _componentsMixinsInputHelpers = require("../../../components/mixins/inputHelpers");

var _componentsMixinsInputHelpers2 = _interopRequireDefault(_componentsMixinsInputHelpers);

var _componentsMixinsViewerCommon = require("../../../components/mixins/viewerCommon");

var _componentsMixinsViewerCommon2 = _interopRequireDefault(_componentsMixinsViewerCommon);

var GroupView = _react2["default"].createClass({
  displayName: "GroupView",

  mixins: [_componentsMixinsGroupMixins2["default"], _componentsMixinsViewerCommon2["default"]],

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  propTypes: {
    item: _react2["default"].PropTypes.object.isRequired
  },

  getMembers: function getMembers(groupid) {
    if (_storesUsersStore2["default"].getUsersByGroup(groupid)) {
      return _storesUsersStore2["default"].getUsersByGroup(groupid);
    } else {
      return [];
    }
  },

  createUserDisplayList: function createUserDisplayList(groupid) {
    var listUserItemArray = [];
    var users = this.getMembers(groupid);

    for (var i = 0; i < users.length; i++) {
      listUserItemArray.push(_react2["default"].createElement(
        _reactBootstrap2["default"].ListGroupItem,
        null,
        users[i].username
      ));
    }

    return listUserItemArray;
  },

  render: function render() {
    var builtInGroupAlert = null;
    var editButtons = null;

    if (this.props.item["builtin"]) {
      builtInGroupAlert = _react2["default"].createElement(
        _reactBootstrap2["default"].Alert,
        { bsStyle: "info",
          className: "text-center" },
        _react2["default"].createElement(
          "b",
          null,
          "This is a built-in FreeNAS group."
        )
      );
    }

    editButtons = _react2["default"].createElement(
      _reactBootstrap2["default"].ButtonToolbar,
      null,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-left",
          disabled: this.props.item["builtin"],
          onClick: this.deleteGroup,
          bsStyle: "danger" },
        "Delete Group"
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-right",
          onClick: this.props.handleViewChange.bind(null, "edit"),
          bsStyle: "info" },
        "Edit Group"
      )
    );

    return _react2["default"].createElement(
      _reactBootstrap2["default"].Grid,
      { fluid: true },
      editButtons,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Row,
        null,
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 3,
            className: "text-center" },
          _react2["default"].createElement(_componentsViewerViewerUtil2["default"].ItemIcon, { primaryString: this.props.item["name"],
            fallbackString: this.props.item["id"],
            seedNumber: this.props.item["id"] })
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 9 },
          _react2["default"].createElement(
            "h3",
            null,
            this.props.item["name"]
          ),
          _react2["default"].createElement("hr", null)
        )
      ),
      builtInGroupAlert,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Row,
        null,
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 2,
            className: "text-muted" },
          _react2["default"].createElement(
            "h4",
            { className: "text-muted" },
            "Group ID"
          )
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 10 },
          _react2["default"].createElement(
            "h3",
            null,
            this.props.item["id"]
          )
        )
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Row,
        null,
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 12,
            className: "text-muted" },
          _react2["default"].createElement(
            "h4",
            { className: "text-muted" },
            "Users"
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].ListGroup,
            null,
            this.createUserDisplayList(this.props.item["id"])
          )
        )
      ),
      editButtons
    );
  }
});

// EDITOR PANE
var GroupEdit = _react2["default"].createClass({
  displayName: "GroupEdit",

  mixins: [_componentsMixinsInputHelpers2["default"], _componentsMixinsGroupMixins2["default"], _componentsMixinsViewerCommon2["default"]],

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  propTypes: {
    item: _react2["default"].PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    var remoteState = this.setRemoteState(this.props);

    return {
      locallyModifiedValues: {},
      remotelyModifiedValues: {},
      remoteState: remoteState,
      mixedValues: this.props.item,
      lastSentValues: {},
      dataKeys: this.props.viewData["format"]["dataKeys"]
    };
  },

  componentWillRecieveProps: function componentWillRecieveProps(nextProps) {
    var newRemoteModified = {};
    var newLocallyModified = {};

    // remotelyModifiedValues represents everything that's changed remotely
    // since the view was opened. This is the difference between the newly arriving
    // props and the initial ones. Read-only and unknown values are ignored.
    // TODO: Use this to show alerts for remote changes on sections the local
    // administrator is working on.
    var mismatchedRemoteFields = _lodash2["default"].pick(nextProps.item, function (value, key) {
      return _lodash2["default"].isEqual(this.state.remoteState[key], value);
    }, this);

    newRemoteModified = this.removeReadOnlyFields(mismatchedRemoteFields, nextProps.viewData["format"]["dataKeys"]);

    // remoteState records the item as it was when the view was first
    // opened. This is used to mark changes that have occurred remotely since
    // the user began editing.
    // It is important to know if the incoming change resulted from a call
    // made by the local administrator. When this happens, we reset the
    // remoteState to get rid of remote edit markers, as the local version
    // has thus become authoritative.
    // We check this by comparing the incoming changes (newRemoteModified) to the
    // last request sent (this.state.lastSentValues). If this check succeeds,
    // we reset newLocallyModified and newRemoteModified, as there are no longer
    // any remote or local changes to record.
    // TODO: Do this in a deterministic way, instead of relying on comparing
    // values.
    if (_lodash2["default"].isEqual(this.state.lastSentValues, newRemoteModified)) {
      newRemoteModified = {};
      newLocallyModified = {};
      this.setState({
        remoteState: this.setRemoteState(nextProps),
        locallyModifiedValues: newLocallyModified
      });
    }

    this.setState({
      remotelyModifiedValues: newRemoteModified
    });
  },

  submitGroupUpdate: function submitGroupUpdate() {
    var valuesToSend = this.removeReadOnlyFields(this.state.locallyModifiedValues, this.state.dataKeys);

    // Only bother to submit an update if there is anything to update.
    if (!_lodash2["default"].isEmpty(valuesToSend)) {
      _middlewareGroupsMiddleware2["default"].updateGroup(this.props.item["id"], valuesToSend, this.submissionRedirect(valuesToSend));
      // Save a record of the last changes we sent.
      this.setState({
        lastSentValues: valuesToSend
      });
    } else {
      console.warn("Attempted to send a Group update with no valid fields.");
    }
  },

  render: function render() {
    var builtInGroupAlert = null;
    var editButtons = null;
    var inputForm = null;

    if (this.props.item["builtin"]) {
      builtInGroupAlert = _react2["default"].createElement(
        _reactBootstrap2["default"].Alert,
        { bsStyle: "warning",
          className: "text-center" },
        _react2["default"].createElement(
          "b",
          null,
          "You should only edit a system group if you know exactly what you are doing."
        )
      );
    }

    editButtons = _react2["default"].createElement(
      _reactBootstrap2["default"].ButtonToolbar,
      null,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-left",
          disabled: this.props.item["builtin"],
          onClick: this.deleteGroup,
          bsStyle: "danger" },
        "Delete Group"
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-right",
          onClick: this.props.handleViewChange.bind(null, "view"),
          bsStyle: "default" },
        "Cancel"
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-right",
          disabled: _lodash2["default"].isEmpty(this.state.locallyModifiedValues) ? true : false,
          onClick: this.submitGroupUpdate,
          bsStyle: "info" },
        "Save Changes"
      )
    );

    inputForm = _react2["default"].createElement(
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
            { xs: 12 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              label: "Group ID",
              value: this.state.mixedValues["id"] ? this.state.mixedValues["id"] : "",
              onChange: this.editHandleValueChange.bind(null, "id"),
              ref: "id",
              key: "id",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["id"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8",
              disabled: !this.isMutable("id", this.state.dataKeys) }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              label: "Group Name",
              value: this.state.mixedValues["name"] ? this.state.mixedValues["name"] : "",
              onChange: this.editHandleValueChange.bind(null, "name"),
              ref: "name",
              key: "name",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["name"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8",
              disabled: !this.isMutable("name", this.state.dataKeys) })
          )
        )
      )
    );

    return _react2["default"].createElement(
      _reactBootstrap2["default"].Grid,
      { fluid: true },
      editButtons,
      builtInGroupAlert,
      inputForm,
      editButtons
    );
  }
});

// CONTROLLER-VIEW
var GroupItem = _react2["default"].createClass({
  displayName: "GroupItem",

  propTypes: {
    viewData: _react2["default"].PropTypes.object.isRequired
  },

  mixins: [_componentsMixinsRouterShim2["default"], _componentsMixinsClientStatus2["default"]],

  getInitialState: function getInitialState() {
    return {
      targetGroup: this.getGroupFromStore(),
      currentMode: "view",
      activeRoute: this.getDynamicRoute()
    };
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var activeRoute = this.getDynamicRoute();

    if (activeRoute !== prevState.activeRoute) {
      this.setState({
        targetGroup: this.getGroupFromStore(),
        currentMode: "view",
        activeRoute: activeRoute
      });
    }
  },

  componentDidMount: function componentDidMount() {
    _storesGroupsStore2["default"].addChangeListener(this.updateGroupInState);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesGroupsStore2["default"].removeChangeListener(this.updateGroupInState);
  },

  getGroupFromStore: function getGroupFromStore() {
    return _storesGroupsStore2["default"].findGroupByKeyValue(this.props.viewData.format["selectionKey"], this.getDynamicRoute());
  },

  updateGroupInState: function updateGroupInState() {
    this.setState({ targetGroup: this.getGroupFromStore() });
  },

  handleViewChange: function handleViewChange(nextMode, event) {
    this.setState({ currentMode: nextMode });
  },

  render: function render() {
    var DisplayComponent = null;
    var processingText = "";

    if (this.state.SESSION_AUTHENTICATED && this.state.targetGroup) {

      // PROCESSING OVERLAY
      if (_storesGroupsStore2["default"].isLocalTaskPending(this.state.targetGroup["id"])) {
        processingText = "Saving changes to '" + this.state.targetGroup[this.props.viewData.format["primaryKey"]] + "'";
      } else if (_storesGroupsStore2["default"].isGroupUpdatePending(this.state.targetGroup["id"])) {
        processingText = "Group '" + this.state.targetGroup[this.props.viewData.format["primaryKey"]] + "' was updated remotely.";
      }

      // DISPLAY COMPONENT
      var childProps = {
        handleViewChange: this.handleViewChange,
        item: this.state.targetGroup,
        viewData: this.props.viewData
      };

      switch (this.state.currentMode) {
        default:
        case "view":
          DisplayComponent = _react2["default"].createElement(GroupView, childProps);
          break;
        case "edit":
          DisplayComponent = _react2["default"].createElement(GroupEdit, childProps);
          break;
      }
    }

    return _react2["default"].createElement(
      "div",
      { className: "viewer-item-info" },
      _react2["default"].createElement(_componentsViewerEditorEditorUtil2["default"].updateOverlay, { updateString: processingText }),
      DisplayComponent
    );
  }
});

exports["default"] = GroupItem;
module.exports = exports["default"];
/* "Edit Group" Button - Top */ /* Shows a warning if the group account is built in */ /* Primary group data overview */ /* "Edit Group" Button - Bottom */ /*Group id*/ /* name */ /* Save and Cancel Buttons - Top */ /* Shows a warning if the group is built in */ /* Save and Cancel Buttons - Bottom */ /* Overlay to block interaction while tasks or updates are processing */
//# sourceMappingURL=GroupItem.js.map