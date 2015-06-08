// CLIENT STATUS MIXIN
// ===================
// This mixin contains a set of common helper methods which may be used to
// reduce the amount of boilerplate code in views which depend on some aspect
// of the FreeNAS webapp having a certain state - for example, being logged in.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _storesSessionStore = require("../../stores/SessionStore");

var _storesSessionStore2 = _interopRequireDefault(_storesSessionStore);

module.exports = {

  getInitialState: function getInitialState() {
    return {
      SESSION_AUTHENTICATED: _storesSessionStore2["default"].getLoginStatus()
    };
  },

  componentDidMount: function componentDidMount() {
    _storesSessionStore2["default"].addChangeListener(this.handleSessionChange);
  },

  handleSessionChange: function handleSessionChange() {
    this.setState({ SESSION_AUTHENTICATED: _storesSessionStore2["default"].getLoginStatus() });
  }

};
//# sourceMappingURL=clientStatus.js.map
