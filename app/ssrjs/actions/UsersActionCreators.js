// Users Action Creators
// ==================================
// Receive and handle events from the middleware, and call the dispatcher.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var UsersActionCreators = (function () {
  function UsersActionCreators() {
    _classCallCheck(this, UsersActionCreators);
  }

  _createClass(UsersActionCreators, null, [{
    key: "receiveUsersList",
    value: function receiveUsersList(rawUsers) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.RECEIVE_RAW_USERS,
        rawUsers: rawUsers
      });
    }
  }, {
    key: "receiveUserUpdateTask",
    value: function receiveUserUpdateTask(taskID, userID) {
      _dispatcherFreeNASDispatcher2["default"].handleClientAction({ type: _constantsFreeNASConstants.ActionTypes.RECEIVE_USER_UPDATE_TASK,
        taskID: taskID,
        userID: userID
      });
    }
  }]);

  return UsersActionCreators;
})();

;

exports["default"] = UsersActionCreators;
module.exports = exports["default"];
//# sourceMappingURL=UsersActionCreators.js.map
