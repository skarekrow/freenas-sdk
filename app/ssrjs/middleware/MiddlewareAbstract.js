// ABSTRACT MIDDLEWARE BASE CLASS
// ==============================
// A common abstract base class for all other Middleware classes to extend.
// Among other things, this prevents the class from being constructed with
// `new`, and only allows calling of its static methods. If you need to
// instantiate a Middleware Utility Class, you're probably doing something
// wrong.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MiddlewareAbstract = function MiddlewareAbstract() {
  _classCallCheck(this, MiddlewareAbstract);

  throw Error("Middleware Utility Classes should not be constructed by " + "`new`. Call the static methods of this class instead.");
};

exports["default"] = MiddlewareAbstract;
module.exports = exports["default"];
//# sourceMappingURL=MiddlewareAbstract.js.map
