// Event Log Debug Tab
// ===================

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

// Middleware

var _middlewareMiddlewareClient = require("../../middleware/MiddlewareClient");

var _middlewareMiddlewareClient2 = _interopRequireDefault(_middlewareMiddlewareClient);

var _storesMiddlewareStore = require("../../stores/MiddlewareStore");

var _storesMiddlewareStore2 = _interopRequireDefault(_storesMiddlewareStore);

var componentLongName = "Debug Tools - Events Tab";

var defaultPredicate = {
  "Object": "{ \"args\": { \"args\": { \"percentage\": 100 } } }",
  "String": "String to search for",
  "RegExp": "[ \"pattern\", \"flags\" ]"
};

var Events = _react2["default"].createClass({
  displayName: "Events",

  getInitialState: function getInitialState() {
    return {
      events: _storesMiddlewareStore2["default"].getEventLog(),
      timeFormat: "absolute",
      predicate: defaultPredicate["Object"],
      predicateType: "Object",
      appliedPredicate: null
    };
  },

  componentDidMount: function componentDidMount() {
    _storesMiddlewareStore2["default"].addChangeListener(this.handleMiddlewareChange);
    _middlewareMiddlewareClient2["default"].subscribe(["task.*", "system.*"], componentLongName);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesMiddlewareStore2["default"].removeChangeListener(this.handleMiddlewareChange);
    _middlewareMiddlewareClient2["default"].unsubscribe(["task.*", "system.*"], componentLongName);
  },

  handleMiddlewareChange: function handleMiddlewareChange(namespace) {
    var newState = {};

    switch (namespace) {
      case "events":
        newState.events = _storesMiddlewareStore2["default"].getEventLog();
        break;
    }

    this.setState(newState);
  },

  handleHumanDateSelect: function handleHumanDateSelect(event) {
    this.setState({ timeFormat: "human" });
  },

  handleAbsoluteDateSelect: function handleAbsoluteDateSelect(event) {
    this.setState({ timeFormat: "absolute" });
  },

  handlePredicateChange: function handlePredicateChange(event) {
    this.setState({
      predicate: event.target.value,
      appliedPredicate: null
    });
  },

  toggleFilter: function toggleFilter(event) {
    this.setState({ appliedPredicate: this.state.appliedPredicate ? null : this.state.predicate });
  },

  switchPredicateType: function switchPredicateType(predicateType) {
    this.setState({
      appliedPredicate: null,
      predicateType: predicateType,
      predicate: defaultPredicate[predicateType]
    });
  },

  createEventLog: function createEventLog(event, index) {
    var eventObj = event.args;
    var timestamp = null;

    if (this.state.timeFormat === "human") {
      timestamp = _moment2["default"].unix(eventObj.args["timestamp"]).fromNow();
    } else {
      timestamp = _moment2["default"].unix(eventObj.args["timestamp"]).format("YYYY-MM-DD HH:mm:ss");
    }

    return _react2["default"].createElement(
      "div",
      {
        className: "debug-callout",
        key: index },
      _react2["default"].createElement(
        "label",
        null,
        eventObj["name"].split(".")[0]
      ),
      _react2["default"].createElement(
        "h5",
        null,
        eventObj["name"],
        _react2["default"].createElement(
          "small",
          { className: "pull-right" },
          timestamp
        )
      ),
      _react2["default"].createElement(
        "p",
        null,
        eventObj.args.description
      ),
      _react2["default"].createElement(
        "pre",
        { className: "debug-monospace-content" },
        JSON.stringify(eventObj.args, null, 2)
      )
    );
  },

  getPredicateHelp: function getPredicateHelp(predicateType) {
    switch (predicateType) {
      case "Object":
        return _react2["default"].createElement(
          "span",
          null,
          "In \"Object\" mode, the \"Filter Predicate\" field uses ",
          _react2["default"].createElement(
            "code",
            null,
            "_.where()"
          ),
          " from ",
          _react2["default"].createElement(
            "a",
            { href: "http://devdocs.io/lodash/index#where", target: "_blank" },
            "lodash"
          ),
          ", and will return matching entries that satisfy the object comparison. Remember, most ",
          _react2["default"].createElement(
            "code",
            null,
            "event"
          ),
          " objects store their data in the following format: ",
          _react2["default"].createElement(
            "code",
            null,
            "{ args: { args: { /* data is here */ } } }"
          )
        );

      case "String":
        return _react2["default"].createElement(
          "span",
          null,
          "In \"String\" mode, each event entry is converted by ",
          _react2["default"].createElement(
            "code",
            null,
            "JSON.stringify()"
          ),
          ", into a string, and then the string entered in the \"Filter Predicate\" field is used as a substring match."
        );

      case "RegExp":
        return _react2["default"].createElement(
          "span",
          null,
          "In \"String\" mode, each event entry is converted by ",
          _react2["default"].createElement(
            "code",
            null,
            "JSON.stringify()"
          ),
          ", into a string, and then the array entered in the \"Filter Predicate\" field is used to construct a new ",
          _react2["default"].createElement(
            "code",
            null,
            "RegExp"
          ),
          " that will test each string. The first value in the array should be your RegExp test string, and the second is (optionally) the flags (",
          _react2["default"].createElement(
            "code",
            null,
            "g"
          ),
          ", ",
          _react2["default"].createElement(
            "code",
            null,
            "i"
          ),
          ", etc.) to use."
        );

    }
  },

  render: function render() {
    var filteredEventLog = [];
    var logContent = null;

    if (this.state.appliedPredicate) {
      switch (this.state.predicateType) {
        case "Object":
          try {
            filteredEventLog = _lodash2["default"].where(this.state.events, JSON.parse(this.state.predicate));
          } catch (error) {
            window.alert("The entered text could not be parsed as an object", error);
          }
          break;

        case "String":
          try {
            filteredEventLog = _lodash2["default"].filter(this.state.events, (function (eventData) {
              return JSON.stringify(eventData).indexOf(this.state.predicate) !== -1;
            }).bind(this));
          } catch (error) {
            window.alert(error);
          }
          break;

        case "RegExp":
          try {
            var reInput = JSON.parse(this.state.predicate);
            var re = new RegExp(reInput[0], reInput[1] ? reInput[1] : "");
            filteredEventLog = _lodash2["default"].filter(this.state.events, function (eventData) {
              return re.test(JSON.stringify(eventData));
            });
          } catch (error) {
            window.alert(error);
          }
          break;
      }
    }

    if (filteredEventLog.length) {
      logContent = filteredEventLog.map(this.createEventLog);
    } else if (this.state.events.length) {
      logContent = this.state.events.map(this.createEventLog);
    } else {
      logContent = _react2["default"].createElement(
        "h3",
        { className: "text-center" },
        "No log content"
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
          "FreeNAS Event Log"
        ),
        _react2["default"].createElement(
          "div",
          { className: "debug-column-content" },
          logContent
        )
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Options"
        ),
        _react2["default"].createElement(
          "div",
          { className: "debug-column-content well well-sm" },
          _react2["default"].createElement(
            "form",
            { className: "form-horizontal" },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, {
              type: "text",
              value: this.state.predicate,
              onChange: this.handlePredicateChange,
              label: "Filter Predicate",
              labelClassName: "col-xs-2",
              wrapperClassName: "col-xs-10",
              buttonBefore: _react2["default"].createElement(
                _reactBootstrap2["default"].DropdownButton,
                {
                  bsStyle: "default",
                  title: this.state.predicateType
                },
                _react2["default"].createElement(
                  _reactBootstrap2["default"].MenuItem,
                  {
                    onClick: this.switchPredicateType.bind(null, "Object")
                  },
                  "Object"
                ),
                _react2["default"].createElement(
                  _reactBootstrap2["default"].MenuItem,
                  {
                    onClick: this.switchPredicateType.bind(null, "String")
                  },
                  "String"
                ),
                _react2["default"].createElement(
                  _reactBootstrap2["default"].MenuItem,
                  {
                    onClick: this.switchPredicateType.bind(null, "RegExp")
                  },
                  "RegExp"
                )
              ),
              buttonAfter: _react2["default"].createElement(
                _reactBootstrap2["default"].Button,
                {
                  bsStyle: this.state.appliedPredicate ? "success" : "primary",
                  onClick: this.toggleFilter,
                  active: !!this.state.appliedPredicate
                },
                this.state.appliedPredicate ? "Remove Filter" : "Apply Filter"
              ) }),
            _react2["default"].createElement(
              _reactBootstrap2["default"].Col,
              { xs: 10, xsOffset: 2 },
              _react2["default"].createElement(
                "small",
                null,
                this.getPredicateHelp(this.state.predicateType)
              )
            ),
            _react2["default"].createElement(
              "div",
              { className: "form-group" },
              _react2["default"].createElement(
                "label",
                { className: "control-label col-xs-2" },
                "Time Format"
              ),
              _react2["default"].createElement(
                _reactBootstrap2["default"].Col,
                { xs: 10 },
                _react2["default"].createElement(
                  _reactBootstrap2["default"].ButtonGroup,
                  null,
                  _react2["default"].createElement(
                    _reactBootstrap2["default"].Button,
                    {
                      active: this.state.timeFormat === "human",
                      onClick: this.handleHumanDateSelect },
                    "Relative Time"
                  ),
                  _react2["default"].createElement(
                    _reactBootstrap2["default"].Button,
                    {
                      active: this.state.timeFormat === "absolute",
                      onClick: this.handleAbsoluteDateSelect },
                    "Absolute Date"
                  )
                )
              )
            )
          )
        )
      )
    );
  }

});

module.exports = Events;
//# sourceMappingURL=Events.js.map
