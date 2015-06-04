// Users Middleware
// ================
// Handle the lifecycle and event hooks for the Users channel of the middleware

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

var _actionsUsersActionCreators = require("../actions/UsersActionCreators");

var _actionsUsersActionCreators2 = _interopRequireDefault(_actionsUsersActionCreators);

var UsersMiddleware = (function (_AbstractBase) {
  function UsersMiddleware() {
    _classCallCheck(this, UsersMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(UsersMiddleware, _AbstractBase);

  _createClass(UsersMiddleware, null, [{
    key: "subscribe",
    value: function subscribe(componentID) {
      _MiddlewareClient2["default"].subscribe(["users.changed"], componentID);
      _MiddlewareClient2["default"].subscribe(["task.*"], componentID);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(componentID) {
      _MiddlewareClient2["default"].unsubscribe(["users.changed"], componentID);
      _MiddlewareClient2["default"].unsubscribe(["task.*"], componentID);
    }
  }, {
    key: "requestUsersList",
    value: function requestUsersList(ids) {
      _MiddlewareClient2["default"].request("users.query", ids ? [[["id", "in", ids]]] : [], function handleUsersList(rawUsersList) {
        _actionsUsersActionCreators2["default"].receiveUsersList(rawUsersList);
      });
    }
  }, {
    key: "createUser",
    value: function createUser(newUserProps) {
      _MiddlewareClient2["default"].request("task.submit", ["users.create", [newUserProps]], function handleCreateUser(taskID, userID) {
        _actionsUsersActionCreators2["default"].receiveUserUpdateTask(taskID, userID);
      });
    }
  }, {
    key: "updateUser",
    value: function updateUser(userID, changedProps) {
      _MiddlewareClient2["default"].request("task.submit", ["users.update", [userID, changedProps]], function handleUpdateUser(taskID) {
        _actionsUsersActionCreators2["default"].receiveUserUpdateTask(taskID, userID);
      });
    }
  }, {
    key: "deleteUser",
    value: function deleteUser(userID) {
      _MiddlewareClient2["default"].request("task.submit", ["users.delete", [userID]], function handleDeleteUser(taskID, userID) {
        _actionsUsersActionCreators2["default"].receiveUserUpdateTask(taskID, userID);
      });
    }
  }]);

  return UsersMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = UsersMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=UsersMiddleware.js.map