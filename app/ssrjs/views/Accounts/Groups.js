// Groups
// ======
// Viewer for FreeNAS groups.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsViewer = require("../../components/Viewer");

var _componentsViewer2 = _interopRequireDefault(_componentsViewer);

var _middlewareGroupsMiddleware = require("../../middleware/GroupsMiddleware");

var _middlewareGroupsMiddleware2 = _interopRequireDefault(_middlewareGroupsMiddleware);

var _storesGroupsStore = require("../../stores/GroupsStore");

var _storesGroupsStore2 = _interopRequireDefault(_storesGroupsStore);

var _middlewareUsersMiddleware = require("../../middleware/UsersMiddleware");

var _middlewareUsersMiddleware2 = _interopRequireDefault(_middlewareUsersMiddleware);

var _storesUsersStore = require("../../stores/UsersStore");

var _storesUsersStore2 = _interopRequireDefault(_storesUsersStore);

var componentLongName = "Groups";

var viewData = {
  format: require("../../../data/middleware-keys/groups-display.json")[0],
  addEntity: "Add Group",
  routing: {
    "route": "groups-editor",
    "param": "groupID",
    "addentity": "add-group"
  },
  display: {
    filterCriteria: {
      userCreated: {
        name: "local groups",
        testProp: { "builtin": false }
      },
      builtIn: {
        name: "built-in system groups",
        testProp: { "builtin": true }
      }
    },
    remainingName: "other groups",
    ungroupedName: "all other groups",
    allowedFilters: [],
    defaultFilters: [],
    allowedGroups: ["userCreated", "builtIn"],
    defaultGroups: ["userCreated", "builtIn"],
    defaultCollapsed: [] // TODO: Revert this to "builtin" once we have more "userCreated"
  }
};

function getGroupsFromStore() {
  return {
    groupsList: _storesGroupsStore2["default"].getAllGroups()
  };
}

function getUsersStoreData() {
  return {
    usersList: _storesUsersStore2["default"].getAllUsers()
  };
}

var Groups = _react2["default"].createClass({
  displayName: "Groups",

  getInitialState: function getInitialState() {
    return getGroupsFromStore();
  },

  componentDidMount: function componentDidMount() {
    _storesGroupsStore2["default"].addChangeListener(this.handleGroupsChange);
    _middlewareGroupsMiddleware2["default"].requestGroupsList();
    _middlewareGroupsMiddleware2["default"].subscribe(componentLongName);

    _storesUsersStore2["default"].addChangeListener(this.handleUsersChange);
    _middlewareUsersMiddleware2["default"].requestUsersList();
    _middlewareUsersMiddleware2["default"].subscribe(componentLongName);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesGroupsStore2["default"].removeChangeListener(this.handleGroupsChange);
    _middlewareGroupsMiddleware2["default"].unsubscribe(componentLongName);

    _storesUsersStore2["default"].removeChangeListener(this.handleUsersChange);
    _middlewareUsersMiddleware2["default"].unsubscribe(componentLongName);
  },

  handleGroupsChange: function handleGroupsChange() {
    this.setState(getGroupsFromStore());
  },

  handleUsersChange: function handleUsersChange() {
    this.setState(getUsersStoreData());
  },

  render: function render() {
    return _react2["default"].createElement(_componentsViewer2["default"], { header: "Groups",
      inputData: this.state.groupsList,
      viewData: viewData });
  }
});

exports["default"] = Groups;
module.exports = exports["default"];
//# sourceMappingURL=Groups.js.map
