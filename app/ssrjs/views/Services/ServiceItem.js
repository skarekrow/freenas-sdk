// Service Item Template
// =====================

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _componentsMixinsRouterShim = require("../../components/mixins/routerShim");

var _componentsMixinsRouterShim2 = _interopRequireDefault(_componentsMixinsRouterShim);

var _componentsMixinsClientStatus = require("../../components/mixins/clientStatus");

var _componentsMixinsClientStatus2 = _interopRequireDefault(_componentsMixinsClientStatus);

var _componentsViewerViewerUtil = require("../../components/Viewer/viewerUtil");

var _componentsViewerViewerUtil2 = _interopRequireDefault(_componentsViewerViewerUtil);

var _middlewareServicesMiddleware = require("../../middleware/ServicesMiddleware");

var _middlewareServicesMiddleware2 = _interopRequireDefault(_middlewareServicesMiddleware);

var _storesServicesStore = require("../../stores/ServicesStore");

var _storesServicesStore2 = _interopRequireDefault(_storesServicesStore);

var _componentsCommonToggleSwitch = require("../../components/common/ToggleSwitch");

var _componentsCommonToggleSwitch2 = _interopRequireDefault(_componentsCommonToggleSwitch);

var ServiceView = _react2["default"].createClass({
  displayName: "ServiceView",

  propTypes: {
    item: _react2["default"].PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return { serviceState: this.props.item.state === "running" ? true : false };
  },

  configureService: function configureService(action, command) {

    switch (action) {
      // Start stop
      case 1:
        _middlewareServicesMiddleware2["default"].configureService(this.props.item.name, { enable: command });
        break;

      // Start stop once
      case 2:
        _middlewareServicesMiddleware2["default"].updateService(this.props.item.name, command);
        break;

        _middlewareServicesMiddleware2["default"].updateService(serviceName, action);
    }
  },

  render: function render() {

    var pid = null;

    if (this.props.item["pid"] && typeof this.props.item["pid"] === "number") {
      pid = _react2["default"].createElement(
        "h4",
        { className: "text-muted" },
        _componentsViewerViewerUtil2["default"].writeString("PID: " + this.props.item["pid"], "​")
      );
    }

    return _react2["default"].createElement(
      "div",
      { className: "viewer-item-info" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Grid,
        { fluid: true },
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 3,
              className: "text-center" },
            _react2["default"].createElement(_componentsViewerViewerUtil2["default"].ItemIcon, { primaryString: this.props.item["name"],
              fallbackString: this.props.item["name"] })
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 9 },
            _react2["default"].createElement(
              "h3",
              null,
              this.props.item["name"]
            ),
            _react2["default"].createElement(
              "h4",
              { className: "text-muted" },
              _componentsViewerViewerUtil2["default"].writeString(this.props.item["state"], "​")
            ),
            pid,
            _react2["default"].createElement("hr", null),
            _react2["default"].createElement(
              _reactBootstrap2["default"].ButtonToolbar,
              null,
              _react2["default"].createElement(
                _reactBootstrap2["default"].SplitButton,
                { title: "Enable",
                  bsStyle: "success",
                  key: "1",
                  onClick: this.configureService.bind(null, 1, true) },
                _react2["default"].createElement(
                  _reactBootstrap2["default"].MenuItem,
                  { eventKey: "1",
                    onClick: this.configureService.bind(null, 2, "start") },
                  "Enable once"
                ),
                _react2["default"].createElement(
                  _reactBootstrap2["default"].MenuItem,
                  { eventKey: "2" },
                  "Enable after reboot"
                )
              ),
              _react2["default"].createElement(
                _reactBootstrap2["default"].SplitButton,
                { title: "Disable",
                  bsStyle: "danger",
                  key: "2",
                  onClick: this.configureService.bind(null, 1, false) },
                _react2["default"].createElement(
                  _reactBootstrap2["default"].MenuItem,
                  { eventKey: "1",
                    onClick: this.configureService.bind(null, 2, "stop") },
                  "Disable once"
                ),
                _react2["default"].createElement(
                  _reactBootstrap2["default"].MenuItem,
                  { eventKey: "2" },
                  "Disable after reboot"
                ),
                _react2["default"].createElement(
                  _reactBootstrap2["default"].MenuItem,
                  { eventKey: "3" },
                  "Disconnect current users"
                )
              )
            )
          )
        )
      )
    );
  }

});

var ServiceItem = _react2["default"].createClass({
  displayName: "ServiceItem",

  propTypes: {
    viewData: _react2["default"].PropTypes.object.isRequired
  },

  mixins: [_componentsMixinsRouterShim2["default"], _componentsMixinsClientStatus2["default"]],

  getInitialState: function getInitialState() {
    return {
      targetService: this.getServiceFromStore(),
      currentMode: "view",
      activeRoute: this.getDynamicRoute()
    };
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var activeRoute = this.getDynamicRoute();

    if (activeRoute !== prevState.activeRoute) {
      this.setState({
        targetService: this.getServiceFromStore(),
        currentMode: "view",
        activeRoute: activeRoute
      });
    }
  },

  componentDidMount: function componentDidMount() {
    _storesServicesStore2["default"].addChangeListener(this.updateServiceTarget);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesServicesStore2["default"].removeChangeListener(this.updateServiceTarget);
  },

  getServiceFromStore: function getServiceFromStore() {
    return _storesServicesStore2["default"].findServiceByKeyValue(this.props.viewData.format["selectionKey"], this.getDynamicRoute());
  },

  updateServiceTarget: function updateServiceTarget() {
    this.setState({ targetService: this.getServiceFromStore() });
  },

  render: function render() {
    var DisplayComponent = null;

    if (this.state.SESSION_AUTHENTICATED && this.state.targetService) {

      // DISPLAY COMPONENT
      var childProps = {
        handleViewChange: this.handleViewChange,
        item: this.state.targetService,
        viewData: this.props.viewData
      };

      switch (this.state.currentMode) {
        default:
        case "view":
          DisplayComponent = _react2["default"].createElement(ServiceView, childProps);
          break;

        case "edit":
          // TODO
          break;
      }
    }

    return _react2["default"].createElement(
      "div",
      { className: "viewer-item-info" },
      DisplayComponent
    );
  }

});

exports["default"] = ServiceItem;
module.exports = exports["default"];
/* General information */
//# sourceMappingURL=ServiceItem.js.map
