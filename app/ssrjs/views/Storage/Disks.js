// DISKS VIEW
// ==========
// Overview of all the hard disks in your FreeNAS system.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _commonByteCalc = require("../../common/ByteCalc");

var _commonByteCalc2 = _interopRequireDefault(_commonByteCalc);

var _componentsViewer = require("../../components/Viewer");

var _componentsViewer2 = _interopRequireDefault(_componentsViewer);

var _storesDisksStore = require("../../stores/DisksStore");

var _storesDisksStore2 = _interopRequireDefault(_storesDisksStore);

var _middlewareDisksMiddleware = require("../../middleware/DisksMiddleware");

var _middlewareDisksMiddleware2 = _interopRequireDefault(_middlewareDisksMiddleware);

function getDisksFromStore() {
  return { disks: _storesDisksStore2["default"].getAllDisks() };
}

var Disks = _react2["default"].createClass({
  displayName: "Disks",
  getInitialState: function getInitialState() {
    return { inputValue: "",
      disks: getDisksFromStore()
    };
  },

  componentDidMount: function componentDidMount() {
    _storesDisksStore2["default"].addChangeListener(this.handleDisksChange);
    _middlewareDisksMiddleware2["default"].requestDisksOverview();
    _middlewareDisksMiddleware2["default"].subscribe(this.constructor.displayName);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesDisksStore2["default"].removeChangeListener(this.handleDisksChange);
    _middlewareDisksMiddleware2["default"].unsubscribe(this.constructor.displayName);
  },

  handleDisksChange: function handleDisksChange() {
    this.setState(getDisksFromStore());
  },

  handleInputChange: function handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  },

  render: function render() {
    var output = _commonByteCalc2["default"].convertString(this.state.inputValue);

    return _react2["default"].createElement(
      "div",
      null,
      _react2["default"].createElement("input", { onChange: this.handleInputChange,
        value: this.state.inputValue }),
      _react2["default"].createElement(
        "h1",
        null,
        _commonByteCalc2["default"].humanize(output, false, true)
      )
    );
  }

});

exports["default"] = Disks;
module.exports = exports["default"];
//# sourceMappingURL=Disks.js.map
