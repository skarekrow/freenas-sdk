// System Tools
// =======
//

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _middlewareUpdateMiddleware = require("../middleware/UpdateMiddleware");

var _middlewareUpdateMiddleware2 = _interopRequireDefault(_middlewareUpdateMiddleware);

var _componentsIcon = require("../components/Icon");

var _componentsIcon2 = _interopRequireDefault(_componentsIcon);

var _componentsCommonConfDialog = require("../components/common/ConfDialog");

var _componentsCommonConfDialog2 = _interopRequireDefault(_componentsCommonConfDialog);

var SystemTools = _react2["default"].createClass({
  displayName: "SystemTools",

  handleupdatenowbutton: function handleupdatenowbutton() {
    _middlewareUpdateMiddleware2["default"].updatenow();
  },

  render: function render() {
    var updateText = _react2["default"].createElement(
      "div",
      { style: { margin: "5px",
          cursor: "pointer" } },
      _react2["default"].createElement(_componentsIcon2["default"], { glyph: "bomb",
        icoSize: "4em"
      }),
      _react2["default"].createElement("br", null),
      "Update Now!"
    );
    var updateprops = {};
    updateprops.dataText = updateText;
    updateprops.title = "Confirm Update";
    updateprops.bodyText = "Freenas will now Update";
    updateprops.callFunc = this.handleupdatenowbutton;
    return _react2["default"].createElement(
      "main",
      null,
      _react2["default"].createElement(
        "h2",
        null,
        "System Tools View"
      ),
      _react2["default"].createElement(_componentsCommonConfDialog2["default"], updateprops)
    );
  }
});

exports["default"] = SystemTools;
module.exports = exports["default"];
//# sourceMappingURL=SystemTools.js.map
