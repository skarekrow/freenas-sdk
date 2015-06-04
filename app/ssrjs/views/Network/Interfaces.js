// Interfaces
// ==========

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsViewer = require("../../components/Viewer");

var _componentsViewer2 = _interopRequireDefault(_componentsViewer);

var _middlewareInterfacesMiddleware = require("../../middleware/InterfacesMiddleware");

var _middlewareInterfacesMiddleware2 = _interopRequireDefault(_middlewareInterfacesMiddleware);

var _storesInterfacesStore = require("../../stores/InterfacesStore");

var _storesInterfacesStore2 = _interopRequireDefault(_storesInterfacesStore);

var componentLongName = "Interfaces";

var viewData = {
  format: require("../../../data/middleware-keys/interfaces-display.json")[0],
  routing: { route: "interfaces-editor",
    param: "interfaceID"
  },
  display: { filterCriteria: { connected: { name: "connected interfaces",
        testProp: { link_state: "LINK_STATE_UP" }
      },
      disconnected: { name: "disconnected interfaces",
        testprop: { link_state: "LINK_STATE_DOWN" }
      },
      unknown: { name: "invalid or unknown interfaces",
        testprop: { link_state: "LINK_STATE_UNKNOWN" }
      }
    },
    remainingName: "other interfaces",
    ungroupedName: "all interfaces",
    allowedFilters: [],
    defaultFilters: [],
    allowedGroups: ["connected", "disconnected", "unknown"],
    defaultGroups: ["connected", "disconnected", "unknown"],
    defaultCollapsed: ["unknown"]
  }
};

function getInterfacesFromStore() {
  return { interfacesList: _storesInterfacesStore2["default"].getAllInterfaces() };
}

var Interfaces = _react2["default"].createClass({
  displayName: "Interfaces",

  getInitialState: function getInitialState() {
    return getInterfacesFromStore();
  },

  componentDidMount: function componentDidMount() {
    _storesInterfacesStore2["default"].addChangeListener(this.handleInterfacesChange);
    _middlewareInterfacesMiddleware2["default"].requestInterfacesList();
    _middlewareInterfacesMiddleware2["default"].subscribe(componentLongName);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesInterfacesStore2["default"].removeChangeListener(this.handleInterfacesChange);
    _middlewareInterfacesMiddleware2["default"].unsubscribe(componentLongName);
  },

  handleInterfacesChange: function handleInterfacesChange() {
    this.setState(getInterfacesFromStore());
  },

  render: function render() {
    return _react2["default"].createElement(_componentsViewer2["default"], {
      header: "Interfaces",
      inputData: this.state.interfacesList,
      viewData: viewData });
  }

});

exports["default"] = Interfaces;
module.exports = exports["default"];
//# sourceMappingURL=Interfaces.js.map