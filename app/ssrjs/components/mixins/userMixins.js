// User Editing Mixins
// ===================
// Various things that are needed for just about any view that will be editing users.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _middlewareShellMiddleware = require("../../middleware/ShellMiddleware");

var _middlewareShellMiddleware2 = _interopRequireDefault(_middlewareShellMiddleware);

var _storesUsersStore = require("../../stores/UsersStore");

var _storesUsersStore2 = _interopRequireDefault(_storesUsersStore);

var _middlewareUsersMiddleware = require("../../middleware/UsersMiddleware");

var _middlewareUsersMiddleware2 = _interopRequireDefault(_middlewareUsersMiddleware);

module.exports = {

  componentDidMount: function componentDidMount() {
    _middlewareShellMiddleware2["default"].requestAvailableShells((function (shells) {
      var systemShells = _lodash2["default"].map(shells, function (shell) {
        return { name: shell };
      }, this);
      // Manually add nologin
      systemShells.push({ name: "/usr/sbin/nologin" });
      this.setState({ shells: systemShells });
    }).bind(this));

    _storesUsersStore2["default"].addChangeListener(this.updateUsersInState);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesUsersStore2["default"].removeChangeListener(this.updateUsersInState);
  },

  updateUsersInState: function updateUsersInState() {
    var usersList = _storesUsersStore2["default"].getAllUsers();
    this.setState({ usersList: usersList });
  }

  // Converts an array of strings into an array of integers. Intended solely
  // for use when submitting groups lists to the middleware.
  , parseGroupsArray: function parseGroupsArray(groupsArray) {
    var integerArray = [];

    integerArray = _lodash2["default"].map(groupsArray, function (group) {
      return _lodash2["default"].parseInt(group);
    }, this);

    return integerArray;
  },

  deleteUser: function deleteUser() {
    _middlewareUsersMiddleware2["default"].deleteUser(this.props.item["id"], this.returnToViewerRoot());
  }
};
//# sourceMappingURL=userMixins.js.map
