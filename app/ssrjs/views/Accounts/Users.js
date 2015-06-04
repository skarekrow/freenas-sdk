// Users
// =====
// Viewer for FreeNAS user accounts and built-in system users.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsViewer = require("../../components/Viewer");

var _componentsViewer2 = _interopRequireDefault(_componentsViewer);

var _middlewareUsersMiddleware = require("../../middleware/UsersMiddleware");

var _middlewareUsersMiddleware2 = _interopRequireDefault(_middlewareUsersMiddleware);

var _storesUsersStore = require("../../stores/UsersStore");

var _storesUsersStore2 = _interopRequireDefault(_storesUsersStore);

var _middlewareGroupsMiddleware = require("../../middleware/GroupsMiddleware");

var _middlewareGroupsMiddleware2 = _interopRequireDefault(_middlewareGroupsMiddleware);

var _storesGroupsStore = require("../../stores/GroupsStore");

var _storesGroupsStore2 = _interopRequireDefault(_storesGroupsStore);

var _storesSessionStore = require("../../stores/SessionStore");

var _storesSessionStore2 = _interopRequireDefault(_storesSessionStore);

var componentLongName = "Users";

var viewData = {
  format: require("../../../data/middleware-keys/users-display.json")[0],
  addEntity: "Add User",
  routing: {
    "route": "users-editor",
    "param": "userID",
    "addentity": "add-user"
  },
  display: {
    filterCriteria: {
      current: {
        name: "current user account",
        testProp: function testProp(user) {
          return user.username === _storesSessionStore2["default"].getCurrentUser();
        }
      },
      userCreated: {
        name: "local user accounts",
        testProp: { "builtin": false }
      },
      builtIn: {
        name: "built-in system accounts",
        testProp: { "builtin": true }
      }
    },
    remainingName: "other user accounts",
    ungroupedName: "all user accounts",
    allowedFilters: [],
    defaultFilters: [],
    allowedGroups: ["current", "userCreated", "builtIn"],
    defaultGroups: ["current", "userCreated", "builtIn"],
    defaultCollapsed: []
  }
};

function getUsersStoreData() {
  return {
    usersList: _storesUsersStore2["default"].getAllUsers()
  };
}

function getGroupsFromStore() {
  return {
    groupsList: _storesGroupsStore2["default"].getAllGroups()
  };
}

var Users = _react2["default"].createClass({
  displayName: "Users",

  getInitialState: function getInitialState() {
    return getUsersStoreData();
  },

  componentDidMount: function componentDidMount() {
    _storesUsersStore2["default"].addChangeListener(this.handleUsersChange);
    _middlewareUsersMiddleware2["default"].requestUsersList();
    _middlewareUsersMiddleware2["default"].subscribe(componentLongName);

    _storesGroupsStore2["default"].addChangeListener(this.handleGroupsChange);
    _middlewareGroupsMiddleware2["default"].requestGroupsList();
    _middlewareGroupsMiddleware2["default"].subscribe(componentLongName);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesUsersStore2["default"].removeChangeListener(this.handleUsersChange);
    _middlewareUsersMiddleware2["default"].unsubscribe(componentLongName);

    _storesGroupsStore2["default"].removeChangeListener(this.handleGroupsChange);
    _middlewareGroupsMiddleware2["default"].unsubscribe(componentLongName);
  },

  handleGroupsChange: function handleGroupsChange() {
    this.setState(getGroupsFromStore());
  },

  handleUsersChange: function handleUsersChange() {
    this.setState(getUsersStoreData());
  },

  render: function render() {
    return _react2["default"].createElement(_componentsViewer2["default"], {
      header: "Users",
      inputData: this.state.usersList,
      viewData: viewData });
  }

});

exports["default"] = Users;
module.exports = exports["default"];
//# sourceMappingURL=Users.js.map