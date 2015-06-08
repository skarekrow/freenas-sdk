// COMMON VIEWER MODE MIXIN
// ========================
// This mixin contains useful methods that apply to cross-cutting concerns in
// the various different viewer modes.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

module.exports = {

  addingEntity: function addingEntity() {
    if (_lodash2["default"].endsWith(this.context.router.getCurrentPathname(), this.props.viewData.routing.addentity)) {
      return true;
    } else {
      return false;
    }
  },

  dynamicPathIsActive: function dynamicPathIsActive() {
    if (this.context.router.getCurrentParams()[this.props.viewData.routing.param]) {
      return true;
    } else {
      return false;
    }
  },

  returnToViewerRoot: function returnToViewerRoot() {
    if (this.isMounted() && this.dynamicPathIsActive()) {
      var currentRoutes = this.context.router.getCurrentRoutes();
      var currentIndex = _lodash2["default"].findIndex(currentRoutes, function (routeData) {
        return _lodash2["default"].contains(routeData["paramNames"], this.props.viewData.routing.param);
      }, this);

      this.context.router.transitionTo(currentRoutes[currentIndex - 1]["path"]);
    }
  },

  tryPathChange: function tryPathChange() {
    if (true) {} else {
      console.log("couldn't do the thing");
      this.returnToViewerRoot();
    }
  }

};
//# sourceMappingURL=viewerCommon.js.map
