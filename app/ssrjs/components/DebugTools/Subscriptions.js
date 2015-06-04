// Subscriptions Debug Tab
// =============

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

// Disclosure Triangles

var _commonDiscTri = require("../common/DiscTri");

var _commonDiscTri2 = _interopRequireDefault(_commonDiscTri);

// Middleware

var _storesSubscriptionsStore = require("../../stores/SubscriptionsStore");

var _storesSubscriptionsStore2 = _interopRequireDefault(_storesSubscriptionsStore);

var _middlewareMiddlewareClient = require("../../middleware/MiddlewareClient");

var _middlewareMiddlewareClient2 = _interopRequireDefault(_middlewareMiddlewareClient);

var componentLongName = "Debug Tools - Subscriptions Tab";

var Subscriptions = _react2["default"].createClass({
  displayName: "Subscriptions",

  getInitialState: function getInitialState() {
    return {
      subscriptions: _storesSubscriptionsStore2["default"].getAllSubscriptions(),
      subsMasks: ""
    };
  },

  componentDidMount: function componentDidMount() {
    _storesSubscriptionsStore2["default"].addChangeListener(this.handleMiddlewareChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesSubscriptionsStore2["default"].removeChangeListener(this.handleMiddlewareChange);
  },

  handleMiddlewareChange: function handleMiddlewareChange() {
    this.setState({
      subscriptions: _storesSubscriptionsStore2["default"].getAllSubscriptions()
    });
  },

  handleMaskInputChange: function handleMaskInputChange(event) {
    this.setState({
      subsMasks: event.target.value
    });
  },

  handleSubsSubmit: function handleSubsSubmit() {
    _middlewareMiddlewareClient2["default"].subscribe(this.state.subsMasks.replace(/\s/g, "").split(","), componentLongName);
  },

  createList: function createList(item, index) {
    return _react2["default"].createElement(
      "li",
      { key: index },
      item
    );
  },

  createRow: function createRow(namespace, index) {
    var listItems = [];
    _lodash2["default"].forEach(this.state.subscriptions[namespace], function (value, key) {
      listItems.push(String(key).concat(" : ", value));
    });
    return _react2["default"].createElement(
      "tr",
      { key: index },
      _react2["default"].createElement(
        "td",
        null,
        namespace
      ),
      _react2["default"].createElement(
        "td",
        null,
        _lodash2["default"].sum(this.state.subscriptions[namespace])
      ),
      _react2["default"].createElement(
        "td",
        null,
        _react2["default"].createElement(
          _commonDiscTri2["default"],
          { key: index, defaultExpanded: false },
          _react2["default"].createElement(
            "ul",
            null,
            listItems.map(this.createList)
          )
        )
      )
    );
  },

  render: function render() {
    var subscriptionsContent = null;
    var removeALL = _middlewareMiddlewareClient2["default"].unsubscribeALL;

    if (_lodash2["default"].isEmpty(this.state.subscriptions)) {
      subscriptionsContent = _react2["default"].createElement(
        "h3",
        { className: "text-center" },
        "No log content"
      );
    } else {
      var subscriptionKeys = _lodash2["default"].sortBy(_lodash2["default"].keys(this.state.subscriptions), (function (key) {
        return this.state.subscriptions[key];
      }).bind(this));

      subscriptionsContent = _react2["default"].createElement(
        _reactBootstrap2["default"].Table,
        { responsive: true },
        _react2["default"].createElement(
          "thead",
          null,
          _react2["default"].createElement(
            "tr",
            null,
            _react2["default"].createElement(
              "th",
              null,
              "Namespace"
            ),
            _react2["default"].createElement(
              "th",
              null,
              "Total Number of subscribed components"
            ),
            _react2["default"].createElement(
              "th",
              null,
              "Individual ComponentID counts"
            )
          )
        ),
        _react2["default"].createElement(
          "tbody",
          null,
          subscriptionKeys.map(this.createRow)
        )
      );
    }

    return _react2["default"].createElement(
      "div",
      { className: "debug-content-flex-wrapper" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Active Subscriptions"
        ),
        _react2["default"].createElement(
          "div",
          { className: "debug-column-content" },
          subscriptionsContent
        )
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Add Subsriptions"
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 5 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "textarea",
              style: { resize: "vertical", height: "34px" },
              placeholder: "Subscription Mask(s)",
              onChange: this.handleMaskInputChange,
              value: this.state.subsMasks })
          )
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 2 },
            _react2["default"].createElement(
              _reactBootstrap2["default"].Button,
              { bsStyle: "primary",
                onClick: this.handleSubsSubmit,
                block: true },
              "Submit"
            )
          )
        ),
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Remove Subscriptions"
        ),
        _react2["default"].createElement(
          "div",
          { className: "debug-column-content" },
          _react2["default"].createElement(
            _reactBootstrap2["default"].Button,
            { block: true, bsStyle: "danger",
              onClick: removeALL },
            "Remove All Subscriptions"
          )
        )
      )
    );
  }

});

module.exports = Subscriptions;
//# sourceMappingURL=Subscriptions.js.map