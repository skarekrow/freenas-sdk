// Group Editing Mixins
// ====================
// Groups-specific shared editing functions.
// TODO: Move anything in this and usersMixins that can be shared outside of the
// Accounts view into a more general mixin.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _storesGroupsStore = require("../../stores/GroupsStore");

var _storesGroupsStore2 = _interopRequireDefault(_storesGroupsStore);

var _middlewareGroupsMiddleware = require("../../middleware/GroupsMiddleware");

var _middlewareGroupsMiddleware2 = _interopRequireDefault(_middlewareGroupsMiddleware);

module.exports = {

  componentDidMount: function componentDidMount() {
    _storesGroupsStore2["default"].addChangeListener(this.updateGroupsListInState);
  },

  componentWillUnMount: function componentWillUnMount() {
    _storesGroupsStore2["default"].removeChangeListener(this.updateGroupsListInState);
  },

  updateGroupsListInState: function updateGroupsListInState() {
    var groupsList = _storesGroupsStore2["default"].getAllGroups();
    this.setState({ groupsList: groupsList });
  }

  // Will return the first available GID above 1000 (to be used as a default).
  , getNextGID: function getNextGID() {
    var groups = {};

    // Turn the array of groups into an object for easier GID checking.
    _lodash2["default"].forEach(this.state.groupsList, function (group) {
      groups[group["id"]] = group;
    });

    var nextGID = 1000;

    // loop until it finds a GID that's not in use
    while (_lodash2["default"].has(groups, nextGID.toString())) {
      nextGID++;
    }

    return nextGID;
  },

  deleteGroup: function deleteGroup() {
    _middlewareGroupsMiddleware2["default"].deleteGroup(this.props.item["id"], this.returnToViewerRoot());
  }
};
//# sourceMappingURL=groupMixins.js.map