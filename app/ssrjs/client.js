// CLIENT ENTRYPOINT
// =================
// Counterpart to ./index.js. client provides interface to the rest of the app,
// and wraps the app's routes component.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

// Routing

var _reactRouter = require("react-router");

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

// Middleware

var _middlewareMiddlewareClient = require("./middleware/MiddlewareClient");

var _middlewareMiddlewareClient2 = _interopRequireDefault(_middlewareMiddlewareClient);

var protocol = window.location.protocol === "https:" ? "wss://" : "ws://";

_middlewareMiddlewareClient2["default"].connect(protocol + document.domain + ":5000/socket");

_reactRouter2["default"].run(_routes2["default"], _reactRouter.HistoryLocation, function (Handler, state) {
  _react2["default"].render(_react2["default"].createElement(Handler, null), document.body);
});
//# sourceMappingURL=client.js.map
