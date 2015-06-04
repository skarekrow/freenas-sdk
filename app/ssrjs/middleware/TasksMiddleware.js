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

// There are no subscribe or unsubscribe functions here, because task
// subscription can be handled directly through the Middleware Client.

var TasksMiddleware = (function (_AbstractBase) {
  function TasksMiddleware() {
    _classCallCheck(this, TasksMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(TasksMiddleware, _AbstractBase);

  _createClass(TasksMiddleware, null, [{
    key: "getCompletedTaskHistory",
    value: function getCompletedTaskHistory(callback, offset) {
      // TODO: This MUST go through the Flux pattern, and needs to be limited
      // by the value set in StoreLimits
      return _MiddlewareClient2["default"].request("task.query", [[["state", "~", "FINISHED|ABORTED|FAILED"]], { offset: offset || 0,
        limit: 100,
        sort: "id",
        dir: "desc"
      }], callback);
    }
  }, {
    key: "abortTask",
    value: function abortTask(taskID) {
      _MiddlewareClient2["default"].request("task.abort", [parseInt(taskID, 10)]);
    }
  }]);

  return TasksMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = TasksMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=TasksMiddleware.js.map