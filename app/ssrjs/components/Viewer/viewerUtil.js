// Viewer Utilities
// ================
// A group of utility functions for the Viewer and associated content.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _componentsIcon = require("../../components/Icon");

var _componentsIcon2 = _interopRequireDefault(_componentsIcon);

var viewerUtil = exports;

viewerUtil.getPastelColor = function (seed) {
  var r, g, b;

  var h = 137.5 * seed % 360 / 360;
  var s = 0.25;
  var v = 0.65;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;break;
    case 1:
      r = q, g = v, b = p;break;
    case 2:
      r = p, g = v, b = t;break;
    case 3:
      r = p, g = q, b = v;break;
    case 4:
      r = t, g = p, b = v;break;
    case 5:
      r = v, g = p, b = q;break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

viewerUtil.markSearch = function (fullString, searchString) {
  var i = 0;
  var splitIndex = 0;
  var searchIndex = 0;
  var splitString = [""];
  fullString = fullString.toString();
  var strLower = fullString.toLowerCase();

  while (i < fullString.length) {
    searchIndex = i + searchString.length;
    if (searchIndex <= fullString.length) {
      // if a match is found, push it onto the splitString and continue
      if (strLower.substring(i, searchIndex) === searchString.toLowerCase()) {
        splitString.push(fullString.substring(i, searchIndex));
        splitString.push("");
        i = searchIndex;
        splitIndex += 2;
      } else {
        // otherwise keep going we haven't found a match
        splitString[splitIndex] += fullString[i];
        i++;
      }
    } else {
      splitString[splitIndex] += fullString[i];
      i++;
    }
  }

  return splitString.map(function (subString, index) {
    if (subString.toLowerCase() === searchString.toLowerCase()) {
      return _react2["default"].createElement(
        "span",
        null,
        _react2["default"].createElement(
          "mark",
          null,
          subString
        )
      );
    } else {
      return _react2["default"].createElement(
        "span",
        null,
        subString
      );
    }
  });
};

viewerUtil.ItemIcon = _react2["default"].createClass({
  displayName: "ItemIcon",

  propTypes: {
    iconImage: _react2["default"].PropTypes.string,
    fontIcon: _react2["default"].PropTypes.string,
    size: _react2["default"].PropTypes.number,
    fontSize: _react2["default"].PropTypes.number,
    primaryString: _react2["default"].PropTypes.any,
    fallbackString: _react2["default"].PropTypes.any.isRequired,
    seedNumber: _react2["default"].PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      size: null,
      fontSize: null
    };
  },

  componentWillMount: function componentWillMount() {
    this.setIcon(this.props);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setIcon(this.props);
  },

  setIcon: function setIcon(props) {
    // If there's a profile picture already, don't bother with an icon.
    if (!props.iconImage) {
      // Font Icon overrides initials icon, but only needs a color.
      if (props.fontIcon) {
        this.setIconColor(this.props);
      } else {
        this.setInitialsIcon(this.props);
      }
    }
  },

  setInitialsIcon: function setInitialsIcon(props) {
    var initials = "";

    if (props.primaryString) {
      initials = props.primaryString.toString().trim().split(" ").map(function (word) {
        return word[0];
      });
    } else {
      initials = props.fallbackString;
    }

    this.setState({
      initials: (initials[0] + (initials.length > 1 ? initials[initials.length - 1] : "")).toUpperCase()
    });

    this.setIconColor(this.props);
  },

  setIconColor: function setIconColor(props) {
    var userRGB;

    if (typeof props.seedNumber === "number") {
      userRGB = viewerUtil.getPastelColor(props.seedNumber);
    } else {
      userRGB = viewerUtil.getPastelColor(props.primaryString.length + props.fallbackString.length);
    }

    this.setState({
      userColor: "rgb(" + userRGB.join(",") + ")"
    });
  },

  render: function render() {
    if (this.props.iconImage) {
      // TODO: BASE64 encoded user images from middleware
      return _react2["default"].createElement(
        "div",
        { className: "icon",
          style: { height: this.props.size,
            width: this.props.size } },
        _react2["default"].createElement("img", { className: "image-icon", src: "data:image/jpg;base64," + this.props.iconImage })
      );
    } else if (this.props.fontIcon) {
      // Use a Font Icon, but only if there isn't a specific image specified.
      return _react2["default"].createElement(
        "div",
        { className: "icon",
          style: { background: this.state.userColor ? this.state.userColor : null,
            height: this.props.size,
            width: this.props.size } },
        _react2["default"].createElement(
          "span",
          { className: "font-icon",
            style: { fontSize: this.props.fontSize + "em" } },
          _react2["default"].createElement(_componentsIcon2["default"], { glyph: this.props.fontIcon })
        )
      );
    } else {
      // Using the Initials icon is a last resort.
      return _react2["default"].createElement(
        "div",
        { className: "icon",
          style: { background: this.state.userColor ? this.state.userColor : null,
            height: this.props.size,
            width: this.props.size } },
        _react2["default"].createElement(
          "span",
          { className: "initials-icon",
            style: { fontSize: this.props.fontSize + "em" } },
          this.state.initials
        )
      );
    }
  }

});

// Lazy helper for potentially unknown types returned from middleware
viewerUtil.identifyAndWrite = function (entry) {
  switch (typeof entry) {
    case "string":
      return viewerUtil.writeString(entry);

    case "number":
      return viewerUtil.writeString(entry, "0");

    case "boolean":
      return viewerUtil.writeBool(entry);

    default:
      return false;
  }
};

// Return a string if it's defined and non-zero length.
viewerUtil.writeString = function (entry, falseValue) {
  if (entry) {
    return entry;
  } else {
    // Allow a choice of fallback string.
    return falseValue ? falseValue : "--";
  }
};

// Return a check mark if true, X mark if false.
viewerUtil.writeBool = function (entry) {
  if (entry) {
    return _react2["default"].createElement(_componentsIcon2["default"], { className: "text-primary",
      glyph: "check" });
  } else {
    return _react2["default"].createElement(_componentsIcon2["default"], { className: "text-muted",
      glyph: "times" });
  }
};

// A simple data cell whose title is a string, and whose value is represented
// based on its type (eg. check mark for boolean). colNum is used to scale the
// output to the number of columns desired. Only 2, 3, and 4 should be used.
// On small screens, the number of columns is always 2.
viewerUtil.DataCell = _react2["default"].createClass({
  displayName: "DataCell",

  propTypes: {
    title: _react2["default"].PropTypes.string.isRequired,
    colNum: _react2["default"].PropTypes.number.isRequired,
    entry: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.bool, _react2["default"].PropTypes.number]).isRequired
  },
  render: function render() {
    if (typeof this.props.entry !== "undefined") {
      return _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { className: "text-center",
          xs: 6, sm: 12 / this.props.colNum },
        _react2["default"].createElement(
          "h4",
          { className: "text-muted" },
          this.props.title
        ),
        _react2["default"].createElement(
          "h4",
          null,
          viewerUtil.identifyAndWrite(this.props.entry)
        )
      );
    } else {
      return null;
    }
  }
});
//# sourceMappingURL=viewerUtil.js.map
