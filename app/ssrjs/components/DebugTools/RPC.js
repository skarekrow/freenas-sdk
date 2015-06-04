// RPC Debug Tab
// =============

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

// Middleware

var _middlewareMiddlewareClient = require("../../middleware/MiddlewareClient");

var _middlewareMiddlewareClient2 = _interopRequireDefault(_middlewareMiddlewareClient);

var _storesMiddlewareStore = require("../../stores/MiddlewareStore");

var _storesMiddlewareStore2 = _interopRequireDefault(_storesMiddlewareStore);

// Disclosure Triangles

var _commonDiscTri = require("../common/DiscTri");

var _commonDiscTri2 = _interopRequireDefault(_commonDiscTri);

// Fuzzy TypeAhead

var _commonFuzzyTypeAhead = require("../common/FuzzyTypeAhead");

var _commonFuzzyTypeAhead2 = _interopRequireDefault(_commonFuzzyTypeAhead);

var RPC = _react2["default"].createClass({
  displayName: "RPC",
  getInitialState: function getInitialState() {
    return { services: _storesMiddlewareStore2["default"].getAvailableRPCServices(),
      methods: _storesMiddlewareStore2["default"].getAvailableRPCMethods(),
      submissionPending: false,
      results: [],
      methodValue: "",
      argsValue: "[]"
    };
  },

  componentDidMount: function componentDidMount() {
    _storesMiddlewareStore2["default"].addChangeListener(this.handleMiddlewareChange);
    _middlewareMiddlewareClient2["default"].getServices();
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesMiddlewareStore2["default"].removeChangeListener(this.handleMiddlewareChange);
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var _this = this;

    if (this.state.submissionPending !== prevState.submissionPending && window) {
      (function () {
        var progressNode = _react2["default"].findDOMNode(_this.refs.pendingProgressBar);
        if (_this.state.submissionPending) {
          _this.progressDisplayTimeout = setTimeout(function () {
            Velocity(progressNode, "fadeIn", { duration: 500 });
          }, 500);
        } else {
          clearTimeout(_this.progressDisplayTimeout);
          Velocity(progressNode, "fadeOut", { duration: 250 });
        }
      })();
    }
  },

  handleMiddlewareChange: function handleMiddlewareChange(namespace) {
    var newState = {};

    switch (namespace) {
      case "services":
        var availableServices = _storesMiddlewareStore2["default"].getAvailableRPCServices();
        newState.services = availableServices;
        if (availableServices.length) {
          availableServices.forEach(function (service) {
            _middlewareMiddlewareClient2["default"].getMethods(service);
          });
        }
        break;

      case "methods":
        newState.methods = _storesMiddlewareStore2["default"].getAvailableRPCMethods();
        break;
    }

    this.setState(newState);
  },

  handleRPCSubmit: function handleRPCSubmit(value, otherArg) {
    var val = value;
    // The below is hack to avoid the single-click event's call to
    // handleRPCSubmit to assign a SyntheticMouseEvent to val
    // Fix if possible.
    if (typeof val === "object") {
      val = this.state.methodValue;
    }
    this.setState({ submissionPending: true });

    _middlewareMiddlewareClient2["default"].request(val, JSON.parse(this.state.argsValue), (function (results) {
      this.setState({ submissionPending: false,
        results: results
      });
    }).bind(this));
  },

  handleMethodClick: function handleMethodClick(rpcString) {
    this.setState({ methodValue: rpcString });
  },

  handleMethodDbClick: function handleMethodDbClick(rpcString) {
    this.setState({ methodValue: rpcString });
    this.handleRPCSubmit(rpcString);
  },

  optionSelected: function optionSelected() {
    this.setState({ methodValue: arguments[0].trim() });
  },

  handleArgsInputChange: function handleArgsInputChange(event) {
    this.setState({ argsValue: event.target.value });
  },

  handleResultsChange: function handleResultsChange(event) {
    this.setState({ results: this.state.results });
  },

  createMethodPanel: function createMethodPanel(service, index) {
    if (this.state.methods[service]) {
      var methods = this.state.methods[service].map((function (method, index) {
        var rpcString = service + "." + method["name"];
        return _react2["default"].createElement(
          "a",
          { key: index,
            className: "debug-list-item",
            onClick: this.handleMethodClick.bind(null, rpcString),
            onDoubleClick: this.handleMethodDbClick.bind(null, rpcString) },
          method["name"]
        );
      }).bind(this));

      return _react2["default"].createElement(
        _commonDiscTri2["default"],
        { headerShow: service,
          headerHide: service,
          key: index,
          defaultExpanded: false },
        _react2["default"].createElement(
          _reactBootstrap2["default"].Panel,
          { bsStyle: "info", key: index },
          methods
        )
      );
    } else {
      return null;
    }
  },

  render: function render() {
    var agmeth = [];
    _lodash2["default"].forEach(this.state.methods, function (value, key) {
      var svc = key;
      value.map(function (method, index) {
        agmeth.push(svc + "." + method["name"]);
      });
    });
    return _react2["default"].createElement(
      "div",
      { className: "debug-content-flex-wrapper" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "RPC Interface"
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 5 },
            _react2["default"].createElement(_commonFuzzyTypeAhead2["default"], {
              name: "RPC Fuzzy Search",
              placeholder: "Method Name",
              defaultValue: this.state.methodValue,
              options: agmeth,
              className: "typeahead-list",
              maxVisible: 7,
              onOptionSelected: this.optionSelected,
              customClasses: { input: "typeahead-text-input",
                results: "typeahead-list__container",
                listItem: "typeahead-list__item",
                hover: "typeahead-active"
              } })
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 5 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, {
              type: "textarea",
              disabled: this.state.submissionPending,
              style: { resize: "vertical", height: "34px" },
              placeholder: "Arguments (JSON Array)",
              onChange: this.handleArgsInputChange,
              value: this.state.argsValue })
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 2 },
            _react2["default"].createElement(
              _reactBootstrap2["default"].Button,
              {
                bsStyle: "primary",
                disabled: this.state.submissionPending,
                onClick: this.handleRPCSubmit,
                block: true },
              "Submit"
            )
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 12 },
            _react2["default"].createElement(_reactBootstrap2["default"].ProgressBar, {
              active: true,
              ref: "pendingProgressBar",
              style: { display: "none",
                opacity: 0,
                height: "10px",
                margin: "0 0 6px 0" },
              now: 100 })
          )
        ),
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "RPC Results"
        ),
        _react2["default"].createElement("textarea", { className: "form-control debug-column-content debug-monospace-content",
          value: JSON.stringify(this.state.results, null, 2),
          style: { resize: "vertical" },
          onChange: this.handleResultsChange })
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Available Service Namespaces"
        ),
        _react2["default"].createElement(
          "div",
          { className: "debug-column-content well well-sm" },
          this.state.services.map(this.createMethodPanel)
        )
      )
    );
  }

});

module.exports = RPC;
//# sourceMappingURL=RPC.js.map