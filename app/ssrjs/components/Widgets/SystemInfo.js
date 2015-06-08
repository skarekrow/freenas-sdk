

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Widget = require("../Widget");

var _Widget2 = _interopRequireDefault(_Widget);

var _middlewareSystemMiddleware = require("../../middleware/SystemMiddleware");

var _middlewareSystemMiddleware2 = _interopRequireDefault(_middlewareSystemMiddleware);

var _storesSystemStore = require("../../stores/SystemStore");

var _storesSystemStore2 = _interopRequireDefault(_storesSystemStore);

var _storesUpdateStore = require("../../stores/UpdateStore");

var _storesUpdateStore2 = _interopRequireDefault(_storesUpdateStore);

var _round = require("round");

var _round2 = _interopRequireDefault(_round);

var SystemInfo = _react2["default"].createClass({
  displayName: "SystemInfo",

  getInitialState: function getInitialState() {
    return {
      hardware: "",
      version: "",
      updates: "",
      train: ""
    };
  },

  componentDidMount: function componentDidMount() {
    _storesSystemStore2["default"].addChangeListener(this.handleSystemChange);
    // *Temp. Removed*
    // UpdateStore.addChangeListener( this.handleUpdateChange );

    _middlewareSystemMiddleware2["default"].requestSystemInfo("hardware");
    _middlewareSystemMiddleware2["default"].requestSystemInfo("version");
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesSystemStore2["default"].removeChangeListener(this.handleSystemChange);
    // *Temp. Removed*
    // UpdateStore.removeChangeListener( this.handleUpdateChange );
  },

  handleSystemChange: function handleSystemChange() {
    this.setState({
      hardware: _storesSystemStore2["default"].getSystemInfo("hardware"),
      version: _storesSystemStore2["default"].getSystemInfo("version")
    });
  },

  handleUpdateChange: function handleUpdateChange() {
    this.setState({
      train: _storesUpdateStore2["default"].getUpdate("get_current_train")
      // TODO: Yet to add
      // , updates  : UpdateStore.getUpdate( "check_now_for_updates" )
    });
  },

  render: function render() {
    var memSize = (0, _round2["default"])(this.state.hardware["memory-size"] / 1024 / 1024, 1);
    return _react2["default"].createElement(
      _Widget2["default"],
      {
        dimensions: this.props.dimensions,
        position: this.props.position,
        title: this.props.title,
        size: this.props.size,
        onMouseDownHolder: this.props.onMouseDownHolder,
        refHolder: this.props.refHolder },
      _react2["default"].createElement(
        "div",
        { className: "wd-section wd-cpu-model" },
        _react2["default"].createElement(
          "span",
          { className: "wd-title" },
          "CPU Model:"
        ),
        _react2["default"].createElement(
          "span",
          { className: "wd-value" },
          this.state.hardware["cpu-model"]
        ),
        _react2["default"].createElement(
          "span",
          { className: "wd-value" },
          "with " + this.state.hardware["cpu-cores"] + " cores."
        )
      ),
      _react2["default"].createElement(
        "div",
        { className: "wd-section wd-memory-size" },
        _react2["default"].createElement(
          "span",
          { className: "wd-title" },
          "Memory Size:"
        ),
        _react2["default"].createElement(
          "span",
          { className: "wd-value" },
          memSize + " MB"
        )
      ),
      _react2["default"].createElement(
        "div",
        { className: "wd-section wd-version" },
        _react2["default"].createElement(
          "span",
          { className: "wd-title" },
          "Version:"
        ),
        _react2["default"].createElement(
          "span",
          { className: "wd-value" },
          this.state.version
        )
      ),
      _react2["default"].createElement(
        "div",
        { className: "wd-section wd-train" },
        _react2["default"].createElement(
          "span",
          { className: "wd-title" },
          "Current Update Train:"
        ),
        _react2["default"].createElement(
          "span",
          { className: "wd-value" },
          this.state.train
        )
      )
    );
  }
});

module.exports = SystemInfo;

/* Temp. Removed
        <div className="wd-section wd-update">
          <span className="wd-title">Available updates:</span>
          <span className="wd-value">{this.state.updates}</span>
        </div>
*/
//# sourceMappingURL=SystemInfo.js.map
