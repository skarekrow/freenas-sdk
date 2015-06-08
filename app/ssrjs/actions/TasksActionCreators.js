// Tasks Action Creators
// =====================
// Handle any Task data being sent from middleware which is NOT covered by the
// standard MIDDLEWARE_EVENT action.

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

var TasksActionCreators = (function () {
  function TasksActionCreators() {
    _classCallCheck(this, TasksActionCreators);
  }

  _createClass(TasksActionCreators, null, [{
    key: "receiveTaskHistory",
    value: function receiveTaskHistory(tasks) {
      _dispatcherFreeNASDispatcher2["default"].handleMiddlewareAction({ type: _constantsFreeNASConstants.ActionTypes.RECEIVE_TASK_HISTORY,
        tasks: tasks
      });
    }
  }]);

  return TasksActionCreators;
})();

;

exports["default"] = TasksActionCreators;
module.exports = exports["default"];
//# sourceMappingURL=TasksActionCreators.js.map
