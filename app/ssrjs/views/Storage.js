// Storage
// =======
// View showing files, snapshots, volumes, and disks. Provides utilities to
// manage storage at all levels, including the creation and deletion of ZFS
// pools / volumes, etc.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _componentsMixinsRouterShim = require("../components/mixins/routerShim");

var _componentsMixinsRouterShim2 = _interopRequireDefault(_componentsMixinsRouterShim);

var _componentsSectionNav = require("../components/SectionNav");

var _componentsSectionNav2 = _interopRequireDefault(_componentsSectionNav);

var sections = [{ route: null,
  display: "Files",
  disabled: true
}, { route: null,
  display: "Snapshots",
  disabled: true
}, { route: "null",
  display: "Volumes",
  disabled: true
}, { route: "disks",
  display: "Disks"
}];

var Storage = _react2["default"].createClass({ displayName: "Storage",

  mixins: [_componentsMixinsRouterShim2["default"]],

  render: function render() {
    return _react2["default"].createElement(
      "main",
      null,
      _react2["default"].createElement(_componentsSectionNav2["default"], { views: sections }),
      _react2["default"].createElement(_reactRouter.RouteHandler, null)
    );
  }
});

exports["default"] = Storage;
module.exports = exports["default"];
//# sourceMappingURL=Storage.js.map
