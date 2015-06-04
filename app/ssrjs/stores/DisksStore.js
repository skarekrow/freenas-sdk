// DISKS STORE
// ===========
// Store information about the physical storage devices connected to the FreeNAS
// server, their S.M.A.R.T. status (if available), but not the activity level or
// other highly specific information about the individual components.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var _FluxBase = require("./FluxBase");

var _FluxBase2 = _interopRequireDefault(_FluxBase);

var _middlewareDisksMiddleware = require("../middleware/DisksMiddleware");

var _middlewareDisksMiddleware2 = _interopRequireDefault(_middlewareDisksMiddleware);

var disks = {};

var DisksStore = (function (_FluxStore) {
  function DisksStore() {
    _classCallCheck(this, DisksStore);

    _get(Object.getPrototypeOf(DisksStore.prototype), "constructor", this).call(this);

    this.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(handlePayload.bind(this));
  }

  _inherits(DisksStore, _FluxStore);

  _createClass(DisksStore, [{
    key: "getAllDisks",
    value: function getAllDisks() {
      return disks;
    }
  }]);

  return DisksStore;
})(_FluxBase2["default"]);

;

function handlePayload(payload) {
  var ACTION = payload.action;

  switch (ACTION.type) {

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_DISKS_OVERVIEW:
      ACTION.disksOverview.forEach(function (disk) {
        return disks[disk.serial] = disk;
      });
      break;

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:
      // TODO: There is currently no correct thing to subscribe to
      break;
  }
}

exports["default"] = new DisksStore();
module.exports = exports["default"];
//# sourceMappingURL=DisksStore.js.map