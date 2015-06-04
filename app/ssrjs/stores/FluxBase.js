// FLUX STORE BASE CLASS
// =====================
// Defines some common methods which all stores implement, and properly extends
// EventEmitter.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require("events");

var FluxBaseClass = (function (_EventEmitter) {
  function FluxBaseClass() {
    _classCallCheck(this, FluxBaseClass);

    _get(Object.getPrototypeOf(FluxBaseClass.prototype), "constructor", this).call(this);
    this.CHANGE_EVENT = "change";
  }

  _inherits(FluxBaseClass, _EventEmitter);

  _createClass(FluxBaseClass, [{
    key: "emitChange",
    value: function emitChange(changeMask) {
      this.emit(this.CHANGE_EVENT, changeMask);
    }
  }, {
    key: "addChangeListener",
    value: function addChangeListener(callback) {
      this.on(this.CHANGE_EVENT, callback);
    }
  }, {
    key: "removeChangeListener",
    value: function removeChangeListener(callback) {
      this.removeListener(this.CHANGE_EVENT, callback);
    }
  }]);

  return FluxBaseClass;
})(_events.EventEmitter);

;

exports["default"] = FluxBaseClass;
module.exports = exports["default"];
//# sourceMappingURL=FluxBase.js.map