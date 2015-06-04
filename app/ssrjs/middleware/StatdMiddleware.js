// Widget Data Middleware
// ===================

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

var _actionsStatdActionCreators = require("../actions/StatdActionCreators");

var _actionsStatdActionCreators2 = _interopRequireDefault(_actionsStatdActionCreators);

function createPulseSyntax(dataSource) {
  return "statd." + dataSource + ".pulse";
};

var StatdMiddleware = (function (_AbstractBase) {
  function StatdMiddleware() {
    _classCallCheck(this, StatdMiddleware);

    if (_AbstractBase != null) {
      _AbstractBase.apply(this, arguments);
    }
  }

  _inherits(StatdMiddleware, _AbstractBase);

  _createClass(StatdMiddleware, null, [{
    key: "subscribeToPulse",
    value: function subscribeToPulse(componentID, dataSources) {
      _MiddlewareClient2["default"].subscribe(dataSources.map(createPulseSyntax), componentID);
    }
  }, {
    key: "unsubscribeFromPulse",
    value: function unsubscribeFromPulse(componentID, dataSources) {
      _MiddlewareClient2["default"].unsubscribe(dataSources.map(createPulseSyntax), componentID);
    }
  }, {
    key: "requestWidgetData",
    value: function requestWidgetData(sourceName, startTime, endTime, freq) {
      _MiddlewareClient2["default"].request("statd.output.query", [sourceName, { start: startTime,
        end: endTime,
        frequency: freq
      }], function handleWidgetData(rawWidgetData) {
        _actionsStatdActionCreators2["default"].receiveWidgetData(rawWidgetData, sourceName);
      });
    }
  }]);

  return StatdMiddleware;
})(_MiddlewareAbstract2["default"]);

;

exports["default"] = StatdMiddleware;
module.exports = exports["default"];
//# sourceMappingURL=StatdMiddleware.js.map