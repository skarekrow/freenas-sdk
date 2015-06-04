// Add User Template
// =================
// Handles the process of adding a new user. Provides an interface for setting up
// the configurable attributes of a new user.

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

var _storesUsersStore = require("../../../stores/UsersStore");

var _storesUsersStore2 = _interopRequireDefault(_storesUsersStore);

var _middlewareUsersMiddleware = require("../../../middleware/UsersMiddleware");

var _middlewareUsersMiddleware2 = _interopRequireDefault(_middlewareUsersMiddleware);

var _storesGroupsStore = require("../../../stores/GroupsStore");

var _storesGroupsStore2 = _interopRequireDefault(_storesGroupsStore);

var _middlewareGroupsMiddleware = require("../../../middleware/GroupsMiddleware");

var _middlewareGroupsMiddleware2 = _interopRequireDefault(_middlewareGroupsMiddleware);

var _componentsMixinsInputHelpers = require("../../../components/mixins/inputHelpers");

var _componentsMixinsInputHelpers2 = _interopRequireDefault(_componentsMixinsInputHelpers);

var _componentsMixinsUserMixins = require("../../../components/mixins/userMixins");

var _componentsMixinsUserMixins2 = _interopRequireDefault(_componentsMixinsUserMixins);

var _componentsMixinsGroupMixins = require("../../../components/mixins/groupMixins");

var _componentsMixinsGroupMixins2 = _interopRequireDefault(_componentsMixinsGroupMixins);

var _componentsMixinsViewerCommon = require("../../../components/mixins/viewerCommon");

var _componentsMixinsViewerCommon2 = _interopRequireDefault(_componentsMixinsViewerCommon);

var AddUser = _react2["default"].createClass({
  displayName: "AddUser",

  mixins: [_componentsMixinsInputHelpers2["default"], _componentsMixinsUserMixins2["default"], _componentsMixinsGroupMixins2["default"], _componentsMixinsViewerCommon2["default"]],

  contextTypes: {
    router: _react2["default"].PropTypes.func
  },

  propTypes: {
    viewData: _react2["default"].PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    var defaultValues = { shell: "/bin/csh" };

    var usersList = _storesUsersStore2["default"].getAllUsers();

    return {
      // FIXME: locallyModifiedValues is magical. See handleValueChange and what
      // it calls from inputHelpers.
      locallyModifiedValues: {},
      defaultValues: defaultValues,
      dataKeys: this.props.viewData.format.dataKeys,
      pleaseCreatePrimaryGroup: true,
      usersList: usersList
    };
  },

  handleValueChange: function handleValueChange(key, event) {
    var value = this.refs[key].getValue();
    var newLocallyModifiedValues = this.state.locallyModifiedValues;

    var dataKey = _lodash2["default"].find(this.state.dataKeys, function (dataKey) {
      return dataKey.key === key;
    }, this);

    newLocallyModifiedValues[key] = this.processFormInput(event, value, dataKey);

    this.setState({ locallyModifiedValues: newLocallyModifiedValues });
  }

  // Will return the first available UID above 1000 (to be used as a default).
  , getNextUID: function getNextUID() {
    var users = {};

    // Turn the array of users into an object for easier UID checking.
    _lodash2["default"].forEach(this.state.usersList, function (user) {
      users[user["id"]] = user;
    });

    var nextUID = 1000;

    // loop until it finds a UID that's not in use
    while (_lodash2["default"].has(users, nextUID.toString())) {
      nextUID++;
    }

    return nextUID;
  },

  submitNewUser: function submitNewUser() {
    var routing = this.props.viewData.routing;
    var newUserValues = {};
    var params = {};

    // Stage edited values for submission. Don't include any read-only stuff that got in somehow.
    newUserValues = this.removeReadOnlyFields(this.state.locallyModifiedValues, this.state.dataKeys);

    // Convert the array of strings provided by the form to an array of integers.
    if (!_lodash2["default"].isEmpty(newUserValues["groups"])) {
      newUserValues["groups"] = this.parseGroupsArray(newUserValues["groups"]);
    }

    // If the user requests a new group, make one with the next available GID and the username.
    if (this.state.pleaseCreatePrimaryGroup) {
      var newGID = this.getNextGID();
      _middlewareGroupsMiddleware2["default"].createGroup({ id: newGID,
        name: newUserValues["username"] });
      newUserValues["group"] = newGID;
    }

    // Get ready to send the view to the new user.
    params[routing["param"]] = newUserValues["username"];

    // Submits the user and moves the view to the new user.
    // TODO: Only submit a user if all the required fields are there.
    // TODO: Make sure the new user was actually created before transitioning the route.
    _middlewareUsersMiddleware2["default"].createUser(newUserValues, this.context.router.transitionTo(routing["route"], params));
  },

  cancel: function cancel() {
    this.context.router.transitionTo("users");
  },

  primaryGroupToggle: function primaryGroupToggle(event) {
    this.setState({
      pleaseCreatePrimaryGroup: event.target.checked
    });
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
          onClick: this.submitNewUser,
          bsStyle: "info" },
        "Save New User"
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
            { xs: 8 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              ref: "id",
              label: "User ID",
              defaultValue: this.getNextUID(),
              onChange: this.handleValueChange.bind(null, "id"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "id") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["id"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              ref: "username",
              label: "User Name",
              onChange: this.handleValueChange.bind(null, "username"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "username") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["username"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8",
              required: true }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              ref: "full_name",
              label: "Full Name",
              onChange: this.handleValueChange.bind(null, "full_name"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "full_name") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["full_name"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              ref: "email",
              label: "email",
              onChange: this.handleValueChange.bind(null, "email"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "email") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["email"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(
              _reactBootstrap2["default"].Input,
              { type: "select",
                label: "Shell",
                ref: "shell",
                defaultValue: this.state.defaultValues["shell"],
                onChange: this.handleValueChange.bind(null, "shell"),
                groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "shell") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["shell"]) ? "editor-was-modified" : "",
                labelClassName: "col-xs-4",
                wrapperClassName: "col-xs-8" },
              this.generateOptionsList(this.state.shells, "name")
            ),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "checkbox",
              label: "Automatically Create Primary Group",
              ref: "createPrimaryGroup",
              onChange: this.primaryGroupToggle,
              checked: this.state.pleaseCreatePrimaryGroup,
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(
              _reactBootstrap2["default"].Input,
              { type: "select",
                label: "Select Primary Group",
                ref: "group",
                value: this.state.locallyModifiedValues["group"] ? this.state.locallyModifiedValues["group"] : null,
                onChange: this.handleValueChange.bind(null, "group"),
                groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "group") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["group"]) ? "editor-was-modified" : "",
                labelClassName: "col-xs-4",
                wrapperClassName: "col-xs-8",
                disabled: this.state.pleaseCreatePrimaryGroup },
              this.generateOptionsList(_storesGroupsStore2["default"].getAllGroups(), "id", "name")
            ),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "textarea",
              ref: "sshpubkey",
              label: "Public Key",
              onChange: this.handleValueChange.bind(null, "sshpubkey"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "sshpubkey") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["sshpubkey"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8",
              rows: "10" }),
            _react2["default"].createElement(
              _reactBootstrap2["default"].Input,
              { type: "select",
                ref: "groups",
                label: "Additional Groups",
                onChange: this.handleValueChange.bind(null, "groups"),
                groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "groups") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["groups"]) ? "editor-was-modified" : "",
                labelClassName: "col-xs-4",
                wrapperClassName: "col-xs-8",
                required: true,
                multiple: true },
              this.generateOptionsList(_storesGroupsStore2["default"].getAllGroups(), "id", "name")
            )
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 4 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "checkbox",
              label: "Locked",
              ref: "locked",
              defaultChecked: false,
              onChange: this.handleValueChange.bind(null, "locked"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "locked") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["locked"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "checkbox",
              label: "Sudo",
              ref: "sudo",
              defaultChecked: false,
              onChange: this.handleValueChange.bind(null, "sudo"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "sudo") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["sudo"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "checkbox",
              label: "Password Disabled",
              ref: "password_disabled",
              defaultChecked: false,
              onChange: this.handleValueChange.bind(null, "password_disabled"),
              groupClassName: _lodash2["default"].has(this.state.locallyModifiedValues, "password_disabled") && !_lodash2["default"].isEmpty(this.state.locallyModifiedValues["password_disabled"]) ? "editor-was-modified" : "",
              labelClassName: "col-xs-4",
              wrapperClassName: "col-xs-8" })
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

exports["default"] = AddUser;
module.exports = exports["default"];
/*TODO: Style unedited default values differently from edited ones*/ /* User id */ /* username */ /* Full Name */ /* email */ /* shell */ /* primary group */ /* TODO: Recommend the default group based on the username. Requires creating a group at user-creation time.*/ /* sshpubkey */ /* Additional Groups */ /* locked */ /* sudo */ /* password_disabled */
//# sourceMappingURL=AddUser.js.map