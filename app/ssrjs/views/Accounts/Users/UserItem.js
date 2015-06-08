// User Item Template
// ==================
// Handles the viewing and editing of individual user items. Shows a non-editable
// overview of the user account, and mode-switches to a more standard editor
// panel. User is set by providing a route parameter.

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

var _middlewareUsersMiddleware = require("../../../middleware/UsersMiddleware");

var _middlewareUsersMiddleware2 = _interopRequireDefault(_middlewareUsersMiddleware);

var _storesUsersStore = require("../../../stores/UsersStore");

var _storesUsersStore2 = _interopRequireDefault(_storesUsersStore);

var _storesGroupsStore = require("../../../stores/GroupsStore");

var _storesGroupsStore2 = _interopRequireDefault(_storesGroupsStore);

var _componentsMixinsInputHelpers = require("../../../components/mixins/inputHelpers");

var _componentsMixinsInputHelpers2 = _interopRequireDefault(_componentsMixinsInputHelpers);

var _componentsMixinsUserMixins = require("../../../components/mixins/userMixins");

var _componentsMixinsUserMixins2 = _interopRequireDefault(_componentsMixinsUserMixins);

var _componentsMixinsViewerCommon = require("../../../components/mixins/viewerCommon");

var _componentsMixinsViewerCommon2 = _interopRequireDefault(_componentsMixinsViewerCommon);

// OVERVIEW PANE
var UserView = _react2["default"].createClass({
  displayName: "UserView",

  mixins: [_componentsMixinsUserMixins2["default"], _componentsMixinsViewerCommon2["default"]],

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  propTypes: {
    item: _react2["default"].PropTypes.object.isRequired
  },

  getGroupName: function getGroupName(groupID) {
    var group = _storesGroupsStore2["default"].getGroup(groupID);

    if (group) {
      return group.name;
    } else {
      // TODO: Have a policy to deal with a user assigned to a nonexistant group.
      return null;
    }
  },

  createGroupDisplayList: function createGroupDisplayList() {
    var listGroupItemArray = [];

    listGroupItemArray = _lodash2["default"].map(this.props.item["groups"], function (groupID) {
      var displayItem = null;
      var group = _storesGroupsStore2["default"].getGroup(groupID);

      if (group) {
        displayItem = _react2["default"].createElement(
          _reactBootstrap2["default"].ListGroupItem,
          null,
          group.name
        );
      }

      return displayItem;
    }, this);

    return listGroupItemArray;
  },

  render: function render() {
    var builtInUserAlert = null;
    var editButtons = null;

    if (this.props.item["builtin"]) {
      builtInUserAlert = _react2["default"].createElement(
        _reactBootstrap2["default"].Alert,
        { bsStyle: "info",
          className: "text-center" },
        _react2["default"].createElement(
          "b",
          null,
          "This is a built-in FreeNAS user account."
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
          onClick: this.deleteUser,
          bsStyle: "danger" },
        "Delete User"
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-right",
          onClick: this.props.handleViewChange.bind(null, "edit"),
          bsStyle: "info" },
        "Edit User"
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
          _react2["default"].createElement(_componentsViewerViewerUtil2["default"].ItemIcon, { primaryString: this.props.item["full_name"],
            fallbackString: this.props.item["username"],
            iconImage: this.props.item["user_icon"],
            seedNumber: this.props.item["id"] })
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 9 },
          _react2["default"].createElement(
            "h3",
            null,
            this.props.item["username"]
          ),
          _react2["default"].createElement(
            "h4",
            { className: "text-muted" },
            _componentsViewerViewerUtil2["default"].writeString(this.props.item["full_name"], "​")
          ),
          _react2["default"].createElement(
            "h4",
            { className: "text-muted" },
            _componentsViewerViewerUtil2["default"].writeString(this.props.item["email"], "​")
          ),
          _react2["default"].createElement("hr", null)
        )
      ),
      builtInUserAlert,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Row,
        null,
        _react2["default"].createElement(_componentsViewerViewerUtil2["default"].DataCell, { title: "User ID",
          colNum: 3,
          entry: this.props.item["id"] }),
        _react2["default"].createElement(_componentsViewerViewerUtil2["default"].DataCell, { title: "Primary Group",
          colNum: 3,
          entry: this.getGroupName(this.props.item["group"]) }),
        _react2["default"].createElement(_componentsViewerViewerUtil2["default"].DataCell, { title: "Shell",
          colNum: 3,
          entry: this.props.item["shell"] }),
        _react2["default"].createElement(_componentsViewerViewerUtil2["default"].DataCell, { title: "Locked Account",
          colNum: 3,
          entry: this.props.item["locked"] ? this.props.item["locked"] : false }),
        _react2["default"].createElement(_componentsViewerViewerUtil2["default"].DataCell, { title: "Sudo Access",
          colNum: 3,
          entry: this.props.item["sudo"] ? this.props.item["sudo"] : false }),
        _react2["default"].createElement(_componentsViewerViewerUtil2["default"].DataCell, { title: "Password Disabled",
          colNum: 3,
          entry: this.props.item["password_disabled"] ? this.props.item["password_disabled"] : false }),
        _react2["default"].createElement(_componentsViewerViewerUtil2["default"].DataCell, { title: "Logged In",
          colNum: 3,
          entry: this.props.item["logged-in"] ? this.props.item["logged-in"] : false }),
        _react2["default"].createElement(_componentsViewerViewerUtil2["default"].DataCell, { title: "Home Directory",
          colNum: 3,
          entry: this.props.item["home"] }),
        _react2["default"].createElement(_componentsViewerViewerUtil2["default"].DataCell, { title: "email",
          colNum: 3,
          entry: this.props.item["email"] ? this.props.item["email"] : "" }),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 12,
            className: "text-muted" },
          _react2["default"].createElement(
            "h4",
            { className: "text-muted" },
            "Other Groups"
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].ListGroup,
            null,
            this.createGroupDisplayList()
          )
        )
      ),
      editButtons
    );
  }

});

// EDITOR PANE
var UserEdit = _react2["default"].createClass({
  displayName: "UserEdit",

  mixins: [_componentsMixinsInputHelpers2["default"], _componentsMixinsUserMixins2["default"], _componentsMixinsViewerCommon2["default"]],

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  propTypes: { item: _react2["default"].PropTypes.object.isRequired,
    viewData: _react2["default"].PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    var remoteState = this.setRemoteState(this.props);

    return { locallyModifiedValues: {},
      remotelyModifiedValues: {},
      remoteState: remoteState,
      mixedValues: this.props.item,
      lastSentValues: {},
      dataKeys: this.props.viewData["format"]["dataKeys"]
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var newRemoteModified = {};
    var newLocallyModified = {};
    var dataKeys = nextProps.viewData["format"]["dataKeys"];

    // remotelyModifiedValues represents everything that's changed remotely
    // since the view was opened. This is the difference between the newly arriving
    // props and the initial ones. Read-only and unknown values are ignored.
    // TODO: Use this to show alerts for remote changes on sections the local
    // administrator is working on.
    var mismatchedRemoteFields = _lodash2["default"].pick(nextProps.item, function (value, key) {
      return _lodash2["default"].isEqual(this.state.remoteState[key], value);
    }, this);

    newRemoteModified = this.removeReadOnlyFields(mismatchedRemoteFields, dataKeys);

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
  }

  // TODO: Validate that input values are legitimate for their field. For example,
  // id should be a number.
  , submitUserUpdate: function submitUserUpdate() {
    // Make sure nothing read-only made it in somehow.
    var valuesToSend = this.removeReadOnlyFields(this.state.locallyModifiedValues, this.state.dataKeys);

    // Convert the array of strings provided by the form to an array of integers.
    if (!_lodash2["default"].isEmpty(valuesToSend["groups"])) {
      valuesToSend["groups"] = this.parseGroupsArray(valuesToSend["groups"]);
    }

    // Only bother to submit an update if there is anything to update.
    if (!_lodash2["default"].isEmpty(valuesToSend)) {
      _middlewareUsersMiddleware2["default"].updateUser(this.props.item["id"], valuesToSend, this.submissionRedirect(valuesToSend));

      // Save a record of the last changes we sent.
      this.setState({
        lastSentValues: valuesToSend
      });
    } else {
      console.warn("Attempted to send a User update with no valid fields.");
    }
  }

  // TODO: Currently this section just arbitrarily handles every property the
  // middleware sends in the order the browser sends it. This should be updated
  // to have a deliberate design.
  // TODO: Add alerts when a remote administrator has changed items that the
  // local administrator is also working on.
  , render: function render() {
    var builtInUserAlert = null;
    var editButtons = null;
    var inputForm = null;

    if (this.props.item["builtin"]) {
      builtInUserAlert = _react2["default"].createElement(
        _reactBootstrap2["default"].Alert,
        { bsStyle: "warning",
          className: "text-center" },
        _react2["default"].createElement(
          "b",
          null,
          "You should only edit a system user account if you know exactly what you're doing."
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
          onClick: this.deleteUser,
          bsStyle: "danger" },
        "Delete User"
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
          onClick: this.submitUserUpdate,
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
            { xs: 8 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              label: "User ID",
              defaultValue: this.props.item["id"],
              onChange: this.editHandleValueChange.bind(null, "id"),
              key: "id",
              ref: "id",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["id"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              label: "User Name",
              defaultValue: this.props.item["username"],
              onChange: this.editHandleValueChange.bind(null, "username"),
              key: "username",
              ref: "username",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["username"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              label: "Full Name",
              defaultValue: this.props.item["full_name"],
              onChange: this.editHandleValueChange.bind(null, "full_name"),
              key: "full_name",
              ref: "full_name",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["full_name"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              label: "email",
              defaultValue: this.props.item["email"],
              onChange: this.editHandleValueChange.bind(null, "email"),
              key: "email",
              ref: "email",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["email"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(
              _reactBootstrap2["default"].Input,
              { type: "select",
                label: "Shell",
                defaultValue: this.props.item["shell"],
                onChange: this.editHandleValueChange.bind(null, "shell"),
                key: "shell",
                ref: "shell",
                groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["shell"]) ? "editor-was-modified" : "",
                labelClassName: "col-xs-4",
                wrapperClassName: "col-xs-8" },
              this.generateOptionsList(this.state.shells, "name")
            ),
            _react2["default"].createElement(
              _reactBootstrap2["default"].Input,
              { type: "select",
                label: "Primary Group",
                defaultValue: this.props.item["group"],
                onChange: this.editHandleValueChange.bind(null, "group"),
                key: "group",
                ref: "group",
                groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["group"]) ? "editor-was-modified" : "",
                labelClassName: "col-xs-4",
                wrapperClassName: "col-xs-8" },
              this.generateOptionsList(_storesGroupsStore2["default"].getAllGroups(), "id", "name")
            ),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "textarea",
              label: "Public Key",
              defaultValue: this.props.item["sshpubkey"],
              onChange: this.editHandleValueChange.bind(null, "sshpubkey"),
              key: "sshpubkey",
              ref: "sshpubkey",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["sshpubkey"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8",
              rows: "10" }),
            _react2["default"].createElement(
              _reactBootstrap2["default"].Input,
              { type: "select",
                label: "Other Groups",
                defaultValue: this.props.item["groups"],
                onChange: this.editHandleValueChange.bind(null, "groups"),
                key: "groups",
                ref: "groups",
                groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["groups"]) ? "editor-was-modified" : "",
                labelClassName: "col-xs-4",
                wrapperClassName: "col-xs-8",
                multiple: true },
              this.generateOptionsList(_storesGroupsStore2["default"].getAllGroups(), "id", "name")
            )
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 4 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "checkbox",
              checked: this.state.mixedValues["locked"],
              label: "Locked",
              value: this.state.mixedValues["locked"] ? this.state.mixedValues["locked"] : "",
              defaultValue: this.props.item["locked"],
              onChange: this.editHandleValueChange.bind(null, "locked"),
              key: "locked",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["locked"]) ? "editor-was-modified" : "",
              ref: "locked",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "checkbox",
              checked: this.state.mixedValues["sudo"],
              label: "sudo",
              value: this.state.mixedValues["sudo"] ? this.state.mixedValues["sudo"] : "",
              defaultValue: this.props.item["sudo"],
              onChange: this.editHandleValueChange.bind(null, "sudo"),
              key: "sudo",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["sudo"]) ? "editor-was-modified" : "",
              ref: "sudo",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "checkbox",
              label: "password_disabled",
              checked: this.state.mixedValues["password_disabled"],
              value: this.state.mixedValues["password_disabled"] ? this.state.mixedValues["password_disabled"] : "",
              defaultValue: this.props.item["password_disabled"],
              onChange: this.editHandleValueChange.bind(null, "password_disabled"),
              key: "password_disabled",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["password_disabled"]) ? "editor-was-modified" : "",
              ref: "password_disabled",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "checkbox",
              checked: this.state.mixedValues["logged-in"],
              label: "logged-in",
              value: this.state.mixedValues["logged-in"] ? this.state.mixedValues["logged-in"] : "",
              defaultValue: this.props.item["logged-in"],
              onChange: this.editHandleValueChange.bind(null, "logged-in"),
              key: "logged-in",
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues["logged-in"]) ? "editor-was-modified" : "",
              ref: "logged-in",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" })
          )
        )
      )
    );

    return _react2["default"].createElement(
      _reactBootstrap2["default"].Grid,
      { fluid: true },
      editButtons,
      builtInUserAlert,
      inputForm,
      editButtons
    );
  }

});

// CONTROLLER-VIEW
var UserItem = _react2["default"].createClass({
  displayName: "UserItem",

  propTypes: {
    viewData: _react2["default"].PropTypes.object.isRequired
  },

  mixins: [_componentsMixinsRouterShim2["default"], _componentsMixinsClientStatus2["default"]],

  getInitialState: function getInitialState() {
    return {
      targetUser: this.getUserFromStore(),
      currentMode: "view",
      activeRoute: this.getDynamicRoute()
    };
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var activeRoute = this.getDynamicRoute();

    if (activeRoute !== prevState.activeRoute) {
      this.setState({
        targetUser: this.getUserFromStore(),
        currentMode: "view",
        activeRoute: activeRoute
      });
    }
  },

  componentDidMount: function componentDidMount() {
    _storesUsersStore2["default"].addChangeListener(this.updateUserInState);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesUsersStore2["default"].removeChangeListener(this.updateUserInState);
  },

  getUserFromStore: function getUserFromStore() {
    return _storesUsersStore2["default"].findUserByKeyValue(this.props.viewData.format["selectionKey"], this.getDynamicRoute());
  },

  updateUserInState: function updateUserInState() {
    this.setState({ targetUser: this.getUserFromStore() });
  },

  handleViewChange: function handleViewChange(nextMode, event) {
    this.setState({ currentMode: nextMode });
  },

  render: function render() {
    var DisplayComponent = null;
    var processingText = "";

    if (this.state.SESSION_AUTHENTICATED && this.state.targetUser) {

      // PROCESSING OVERLAY
      if (_storesUsersStore2["default"].isLocalTaskPending(this.state.targetUser["id"])) {
        processingText = "Saving changes to '" + this.state.targetUser[this.props.viewData.format["primaryKey"]] + "'";
      } else if (_storesUsersStore2["default"].isUserUpdatePending(this.state.targetUser["id"])) {
        processingText = "User '" + this.state.targetUser[this.props.viewData.format["primaryKey"]] + "' was updated remotely.";
      }

      // DISPLAY COMPONENT
      var childProps = {
        handleViewChange: this.handleViewChange,
        item: this.state.targetUser,
        viewData: this.props.viewData
      };

      switch (this.state.currentMode) {
        default:
        case "view":
          DisplayComponent = _react2["default"].createElement(UserView, childProps);
          break;

        case "edit":
          DisplayComponent = _react2["default"].createElement(UserEdit, childProps);
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

exports["default"] = UserItem;
module.exports = exports["default"];
/* "Edit User" Button - Top */ /* User icon and general information */ /* Shows a warning if the user account is built in */ /* Primary user data overview */ /* "Edit User" Button - Bottom */ /* User id */ /* username */ /* full_name*/ /* email */ /* shell */ /* primary group */ /* sshpubkey */ /* Other Groups */ /* locked */ /* sudo */ /* password_disabled */ /* logged-in */ /* Save and Cancel Buttons - Top */ /* Shows a warning if the user account is built in */ /* Save and Cancel Buttons - Bottom */ /* Overlay to block interaction while tasks or updates are processing */
//# sourceMappingURL=UserItem.js.map
