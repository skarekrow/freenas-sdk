// Interfaces Flux Store
// =====================

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _dispatcherFreeNASDispatcher = require("../dispatcher/FreeNASDispatcher");

var _dispatcherFreeNASDispatcher2 = _interopRequireDefault(_dispatcherFreeNASDispatcher);

var _constantsFreeNASConstants = require("../constants/FreeNASConstants");

var _middlewareInterfacesMiddleware = require("../middleware/InterfacesMiddleware");

var _middlewareInterfacesMiddleware2 = _interopRequireDefault(_middlewareInterfacesMiddleware);

var CHANGE_EVENT = "change";
var UPDATE_MASK = "network.interface.changed";

var _updatedOnServer = [];
var _localUpdatePending = {};
var _interfaces = [];

var InterfacesStore = _lodash2["default"].assign({}, _events2["default"].prototype, {

  emitChange: function emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getUpdateMask: function getUpdateMask() {
    return UPDATE_MASK;
  },

  getPendingUpdateNames: function getPendingUpdateNames() {
    return _updatedOnServer;
  }

  // Returns true if the selected interface is in the
  // list of interfaces with pending updates.
  , isLocalTaskPending: function isLocalTaskPending(interfaceName) {
    return _lodash2["default"].values(_localUpdatePending).indexof(interfaceName) > -1;
  }

  // Returns true if selected interface is in the list of updated interfaces.
  , isInterfaceUpdatePending: function isInterfaceUpdatePending(linkAddress) {
    return _updatedOnServer.indexof(linkAddress) > -1;
  },

  findInterfaceByKeyValue: function findInterfaceByKeyValue(key, value) {
    // 'interface' is a reserved word. arg renamed 'thisInterface'.
    return _lodash2["default"].find(_interfaces, function (thisInterface) {
      return thisInterface[key] === value;
    });
  },

  getInterface: function getInterface(linkAddress) {
    return _interfaces[linkAddress];
  },

  getAllInterfaces: function getAllInterfaces() {
    return _interfaces;
  }

});

InterfacesStore.dispatchToken = _dispatcherFreeNASDispatcher2["default"].register(function (payload) {
  var action = payload.action;

  switch (action.type) {

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_INTERFACES_LIST:

      // Re-map the complex interface objects into flat ones.
      // TODO: Account for multiple aliases and static configurations.
      var mapInterface = function mapInterface(currentInterface) {

        var newInterface = {};

        // Make the block below less absurdly wide.
        var status = currentInterface.status;

        // Initialize desired fields with existing ones.
        newInterface["name"] = currentInterface["name"] ? currentInterface["name"] : null;
        newInterface["ip"] = status["aliases"][1] ? status["aliases"][1]["address"] : "--";
        newInterface["link_state"] = status["link-state"] ? status["link-state"] : null;
        newInterface["link_address"] = status["link-address"] ? status["link-address"] : null;
        newInterface["flags"] = status["flags"] ? status["flags"] : [];
        newInterface["netmask"] = status["aliases"][1] ? status["aliases"][1]["netmask"] : null;
        newInterface["enabled"] = currentInterface["enabled"] ? true : false;
        newInterface["dhcp"] = currentInterface["dhcp"] ? true : false;
        newInterface["status"] = status;
        newInterface["mtu"] = currentInterface["mtu"] ? currentInterface["mtu"] : null;

        // Figure out interface type. Only knows about Ethernet right now.
        // TODO: There are tons more types that could show up. See:
        // http://fxr.watson.org/fxr/source/net/if_types.h?v=FREEBSD10
        // ETHER and FIBRECHANNEL will definitely have different logos.
        // Many of the others, such as LAPD and CARP will be discarded and only
        // used by other parts of the UI. The vast majority of that list doesn'
        // matter.
        newInterface["type"] = currentInterface["type"] === "ETHER" ? "Ethernet" : "Unknown";

        // Determine Internet Protocol version
        if (!status["aliases"][1]) {
          newInterface["ip_version"] = "IP";
        } else {

          switch (status["aliases"][1]["family"]) {

            case "INET":
              newInterface["ip_version"] = "IPv4";
              break;

            case "INET6":
              newInterface["ip_version"] = "IPv6";
              break;

            default:
            // Nothing to do here.
          }
        }

        // Map the interface type and/or status to an appropriate icon.
        // TODO: This also needs to handle other interface types.
        switch (newInterface["type"]) {

          // Ethernet gets the FontAwesome "exchange" icon for now.
          // TODO: Other conditions, such as different icons for connected and
          // disconnected interfaces of different types.
          case "Ethernet":
            newInterface["font_icon"] = "exchange";
            break;

          default:
            newInterface["icon"] = null;
            break;
        }

        return newInterface;
      };

      _interfaces = action.rawInterfacesList.map(mapInterface);

      InterfacesStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.MIDDLEWARE_EVENT:
      var args = action.eventData.args;

      if (args["name"] === UPDATE_MASK) {
        var updateData = args["args"];

        if (updateData["operation"] === "update") {

          // Not reall sure this is doing something useful.
          Array.prototype.push.apply(_updatedOnServer, updateData["ids"]);
          _middlewareInterfacesMiddleware2["default"].requestInterfacesList();
        }
      }

      InterfacesStore.emitChange();
      break;

    case _constantsFreeNASConstants.ActionTypes.RECEIVE_INTERFACE_CONFIGURE_TASK:
      _localUpdatePending[action.taskID] = action.interfaceName;
      InterfacesStore.emitChange();
      break;

    default:
    // Do nothing
  }
});

module.exports = InterfacesStore;
//# sourceMappingURL=InterfacesStore.js.map