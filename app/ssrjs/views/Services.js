// Services
// =======
//

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsViewer = require("../components/Viewer");

var _componentsViewer2 = _interopRequireDefault(_componentsViewer);

var _middlewareServicesMiddleware = require("../middleware/ServicesMiddleware");

var _middlewareServicesMiddleware2 = _interopRequireDefault(_middlewareServicesMiddleware);

var _storesServicesStore = require("../stores/ServicesStore");

var _storesServicesStore2 = _interopRequireDefault(_storesServicesStore);

var viewData = {
  format: require("../../data/middleware-keys/services-display.json")[0],
  routing: {
    route: "services-editor",
    param: "serviceID"
  },
  display: {
    filterCriteria: {
      running: {
        name: "active services",
        testProp: { state: "running" }
      },
      stopped: {
        name: "stopped services",
        testProp: { state: "stopped" }
      }
    },
    remainingName: "other services",
    ungroupedName: "all services",
    allowedFilters: [],
    defaultFilters: [],
    allowedGroups: ["running", "stopped"],
    defaultGroups: ["running", "stopped"],
    showToggleSwitch: true,
    handleToggle: handleToggle
  }
};

function getServicesFromStore() {
  return {
    servicesList: _storesServicesStore2["default"].getAllServices()
  };
}

function handleToggle(serviceObj, toggled) {
  var serviceName = serviceObj.name;
  var serviceState = serviceObj.state;

  var action = serviceState === "running" ? "stop" : "start";

  _middlewareServicesMiddleware2["default"].updateService(serviceName, action);

  // TODO: Select the service with changing state.
}

var Services = _react2["default"].createClass({
  displayName: "Services",

  getInitialState: function getInitialState() {
    return getServicesFromStore();
  },

  componentDidMount: function componentDidMount() {
    _middlewareServicesMiddleware2["default"].requestServicesList();
    _middlewareServicesMiddleware2["default"].subscribeToTask("Services Viewer");

    _storesServicesStore2["default"].addChangeListener(this.handleServicesChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    _middlewareServicesMiddleware2["default"].unsubscribeFromTask("Services Viewer");
    _storesServicesStore2["default"].removeChangeListener(this.handleServicesChange);
  },

  handleServicesChange: function handleServicesChange() {
    this.setState(getServicesFromStore());
  },

  render: function render() {
    return _react2["default"].createElement(
      "main",
      null,
      _react2["default"].createElement(
        "h2",
        null,
        "Services"
      ),
      _react2["default"].createElement(_componentsViewer2["default"], { header: "Services",
        inputData: this.state.servicesList,
        viewData: viewData })
    );
  }
});

exports["default"] = Services;
module.exports = exports["default"];
//# sourceMappingURL=Services.js.map
