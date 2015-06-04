// BYTE CALCULATOR
// ===============
// Set of common tools used to convert units for data.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UNITS = ["K", "M", "G", "T", "P", "E", "Z"];
var METRIC_PREFIX = ["kilo", "mega", "giga", "tera", "peta", "exa", "zetta"];
var IEC_PREFIX = ["kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi"];

var ByteCalc = (function () {
  function ByteCalc() {
    _classCallCheck(this, ByteCalc);
  }

  _createClass(ByteCalc, null, [{
    key: "convertString",

    // Convert a string that looks like "10KB" or "117 kibibytes" into a Number
    // equal to the equivalent number of bytes. This is a counterpart to the
    // humanize() method. The unit suffix (if provided) is
    value: function convertString(size) {

      var parsedSize = size.replace(/[^a-z0-9.]/gi, "").split(/([a-z]+)/gi, 2);

      var quantity = Array.isArray(parsedSize) && parsedSize[0] ? Number(parsedSize[0]) : null;
      var units = Array.isArray(parsedSize) && parsedSize[1] ? String(parsedSize[1]) : null;

      return this.toBytes.call(this, quantity, units);
    }
  }, {
    key: "getUnitName",

    // Converts between an abbreviation like "KiB" and the long form name
    // (kibibytes). This is only useful for GUI display logic and should not be
    // overloaded to perform actual conversions.
    value: function getUnitName(abbr) {
      if (typeof abbr !== "string") {
        throw new Error("ByteCalc.getUnitName only accepts strings: use an " + "abbreviation like 'KB', or 'KiB'");
      } else {
        var names = undefined;
        var type = this.determineFormat(abbr);

        if (type === "IEC") {
          names = IEC_PREFIX;
        } else if (type === "METRIC") {
          names = METRIC_PREFIX;
        }

        return names[UNITS.indexOf(abbr[0])] + "bytes";
      }
    }
  }, {
    key: "getUnitAbbr",

    // Conversely, this gets the abbreviation, given a long form name
    // ( "kibibytes" becomes "KiB" ).
    value: function getUnitAbbr(name) {
      if (typeof name !== "string") {
        throw new Error("ByteCalc.getUnitAbbr only accepts strings: use a " + "name like 'kilobytes', or 'mebibits'");
      } else {
        var suffix = undefined;
        var type = this.determineFormat(name);

        if (type === "IEC") {
          suffix = "iB";
        } else if (type === "METRIC") {
          suffix = "B";
        }

        return UNITS[UNITS.indexOf(name[0].toUpperCase())] + suffix;
      }
    }
  }, {
    key: "determineFormat",

    // Figure out the numeric base which corresponds to the string provided. This
    // helps back-convert from other units to bytes, since it will give you the
    // base to use in Math.log/Math.pow
    value: function determineFormat(units) {
      if (units && units.length === 3 | units.indexOf("bibyte") > -1) {
        return "IEC";
      } else {
        return "METRIC";
      }
      // Since this function might receive null or false, the fallthrough case is
      // to render everything in metric units (more likely). Unless these specific
      // targets are met, we won't use IEC.
    }
  }, {
    key: "toBytes",

    // Converts from a known quantity and unit into bytes, which is the begining
    // of all other operations. This avoids the inherent awkwardness in trying to
    // turn TB into MiB, for instance
    value: function toBytes(quantity, unit) {
      var format = this.determineFormat(unit);
      var identifier = unit ? unit[0].toUpperCase() : null;
      var exponent = UNITS.indexOf(identifier) + 1;

      var base = undefined;

      if (format === "METRIC") {
        base = 1000;
      } else if (format === "IEC") {
        base = 1024;
      }

      if (exponent > 0) {
        return Number(quantity) * Math.pow(base, exponent);
      } else {
        return Number(quantity);
      }
    }
  }, {
    key: "humanize",

    // Creates a human-friendly string out of a number of bytes. The output should
    // resemble something that any good file browser would show you, intelligently
    // rendering the biggest possible unit with two decimal places. This function
    // can be instructed to output metric or IEC (default is metric). The
    // `verbose` option will output "megabytes" instead of "MB"
    value: function humanize(bytes, IEC, verbose) {
      var base = IEC ? 1024 : 1000;

      var exponent = Math.abs(bytes) < base ? 0 : Math.floor(Math.log(bytes) / Math.log(base));

      var finalSize = bytes / Math.pow(base, exponent);

      var units = "";
      var suffix = "";
      var output = "";

      if (verbose) {
        if (exponent > 0) {
          units = IEC ? IEC_PREFIX[exponent - 1] : METRIC_PREFIX[exponent - 1];
        }

        suffix = finalSize === 1 ? "byte" : "bytes";
      } else {
        // If we desire an abbreviated unit in IEC, our suffix needs an "i"
        if (IEC && exponent > 0) {
          suffix = "iB";
          units = UNITS[exponent - 1];
        }
      }

      // If we're only on bytes or kilobytes, don't bother showing decimal places
      if (exponent <= 1) {
        output = Math.floor(finalSize);
      } else {
        output = finalSize.toFixed(2);
      }

      return output + " " + units + suffix;
    }
  }]);

  return ByteCalc;
})();

exports["default"] = ByteCalc;
module.exports = exports["default"];
//# sourceMappingURL=ByteCalc.js.map