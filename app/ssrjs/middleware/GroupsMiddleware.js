// Groups Middleware
// ================
// Handle the lifecycle and event hooks for the Groups channel of the middleware

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _MiddlewareClient = require("./MiddlewareClient");

var _MiddlewareClient2 = _interopRequireDefault(_MiddlewareClient);

var _MiddlewareAbstract = require("./MiddlewareAbstract");

var _MiddlewareAbstract2 = _interopRequireDefault(_MiddlewareAbstract);

var _actionsGroupsActionCreators = require("../actions/GroupsActionCreators");

var _actionsGroupsActionCreators2 = _interopRequireDefault(_actionsGroupsActionCreators);

var GroupsMiddleware = (function (_AbstractBase) {
  function GroupsMiddleware() {
    _classCallCheck(this, GroupsMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(GroupsMiddleware, _AbstractBase);

  _createClass(GroupsMiddleware, null, [{
    key: "subscribe",
    value: function subscribe(componentID) {
      _MiddlewareClient2["default"].subscribe(["groups.changed"], componentID);
      _MiddlewareClient2["default"].subscribe(["task.*"], componentID);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(componentID) {
      _MiddlewareClient2["default"].unsubscribe(["groups.changed"], componentID);
      _MiddlewareClient2["default"].unsubscribe(["task.*"], componentID);
    }
  }, {
    key: "requestGroupsList",
    value: function requestGroupsList() {
      _MiddlewareClient2["default"].request("groups.query", [], function handleRequestGroupsList(groupsList) {
        _actionsGroupsActionCreators2["default"].receiveGroupsList(groupsList);
      });
    }
  }, {
    key: "createGroup",
    value: function createGroup(newGroupProps) {
      _MiddlewareClient2["default"].request("task.submit", ["groups.create", [newGroupProps]], function handleCreateGroup(taskID, groupID) {
        _actionsGroupsActionCreators2["default"].receiveGroupUpdateTask(taskID, groupID);
      });
    }
  }, {
    key: "updateGroup",
    value: function updateGroup(groupID, props) {
      _MiddlewareClient2["default"].request("task.submit", ["groups.update", [groupID, props]], function handleUpdateGroup(taskID, GroupID) {
        _actionsGroupsActionCreators2["default"].receiveGroupUpdateTask(taskID, groupID);
      });
    }
  }, {
    key: "deleteGroup",
    value: function deleteGroup(groupID) {
      _MiddlewareClient2["default"].request("task.submit", ["groups.delete", [groupID]], function handleDeleteGroup(taskID, groupID) {
        _actionsGroupsActionCreators2["default"].receiveGroupUpdateTask(taskID, groupID);
      });
    }
  }]);

  return GroupsMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = GroupsMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=GroupsMiddleware.js.map
