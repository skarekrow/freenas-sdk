// PRIMARY NAVIGATION
// ==================
// Left sidebar with navigation links for the primary sections of the FreeNAS 10
// user interface.

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _Icon = require("./Icon");

var _Icon2 = _interopRequireDefault(_Icon);

var _DebugToolsEventBus = require("./DebugTools/EventBus");

var _DebugToolsEventBus2 = _interopRequireDefault(_DebugToolsEventBus);

// Path definitions
// TODO: Convert to Flux or other external file
var paths = [{ path: "dashboard",
  icon: "dashboard",
  label: "Dashboard",
  status: "danger",
  disabled: false
}, { path: "storage",
  icon: "magic",
  label: "Storage",
  status: null,
  disabled: false
}, { path: "network",
  icon: "moon-o",
  label: "Network",
  status: null,
  disabled: false
}, { path: "sharing",
  icon: "cut",
  label: "Sharing",
  status: null,
  disabled: true
}, { path: "services",
  icon: "bitcoin",
  label: "Services",
  status: null,
  disabled: false
}, { path: "accounts",
  icon: "paper-plane",
  label: "Accounts",
  status: null,
  disabled: false
}, { path: "tasks",
  icon: "paw",
  label: "Tasks",
  status: null,
  disabled: true
}, { path: "system-tools",
  icon: "ambulance",
  label: "System Tools",
  status: "warning",
  disabled: false
}, { path: "control-panel",
  icon: "paragraph",
  label: "Control Panel",
  status: null,
  disabled: true
}, { path: "power",
  icon: "plug",
  label: "Power",
  status: null,
  disabled: false
}];

var menuTiming = 600;

var PrimaryNavigation = _react2["default"].createClass({
  displayName: "PrimaryNavigation",
  getInitialState: function getInitialState() {
    return { expanded: true };
  },

  componentDidMount: function componentDidMount() {
    // After the component has a real DOM representation, store the auto width
    // value of the navbar
    this.setState({
      fullNavWidth: this.refs.navRoot.getDOMNode().offsetWidth + "px"
    });
  },

  handleMenuToggle: function handleMenuToggle(event) {
    event.stopPropagation();

    if (this.state.expanded) {
      this.collapseMenu();
    } else {
      this.expandMenu();
    }
  },

  expandMenu: function expandMenu() {
    var expandSequence = [{ elements: this.refs.navRoot.getDOMNode(),
      properties: { width: this.state.fullNavWidth },
      options: { duration: menuTiming,
        easing: "easeInOutBounce"
      }
    }, { elements: document.getElementsByClassName("nav-item-label"),
      properties: "fadeIn",
      options: { duration: menuTiming,
        sequenceQueue: false,
        complete: this.setState({ expanded: true })
      }
    }];

    Velocity.RunSequence(expandSequence);
  },

  collapseMenu: function collapseMenu() {
    var collapseSequence = [{ elements: this.refs.navRoot.getDOMNode(),
      properties: { width: "60px" },
      options: { duration: menuTiming,
        easing: "easeInOutBounce"
      }
    }, { elements: document.getElementsByClassName("nav-item-label"),
      properties: "fadeOut",
      options: { duration: menuTiming,
        sequenceQueue: false,
        complete: this.setState({ expanded: false })
      }
    }];

    Velocity.RunSequence(collapseSequence);
  },

  createNavItem: function createNavItem(rawItem, index) {
    if (rawItem["disabled"]) {
      return _react2["default"].createElement(
        "li",
        {
          role: "presentation",
          className: "nav-item disabled",
          key: index },
        _react2["default"].createElement(
          "a",
          { href: "#" },
          _react2["default"].createElement(_Icon2["default"], {
            glyph: rawItem["icon"],
            badgeContent: rawItem["status"] ? "!" : "",
            badgeStyle: rawItem["status"] }),
          _react2["default"].createElement(
            "span",
            { className: "nav-item-label" },
            rawItem["label"]
          )
        )
      );
    } else {
      return _react2["default"].createElement(
        "li",
        {
          role: "presentation",
          className: "nav-item",
          key: index },
        _react2["default"].createElement(
          _reactRouter.Link,
          { to: rawItem["path"] },
          _react2["default"].createElement(_Icon2["default"], {
            glyph: rawItem["icon"],
            badgeContent: rawItem["status"] ? "!" : "",
            badgeStyle: rawItem["status"] }),
          _react2["default"].createElement(
            "span",
            { className: "nav-item-label" },
            rawItem["label"]
          )
        )
      );
    }
  },

  render: function render() {
    // TODO: Revert changes made for #7908 once externally resolved.
    return _react2["default"].createElement(
      _reactBootstrap2["default"].Nav,
      {
        stacked: true,
        ref: "navRoot",
        className: "primary-nav" },
      _react2["default"].createElement(
        "div",
        {
          className: "primary-nav-label-toggle",
          onClick: this.handleMenuToggle },
        "…"
      ),
      paths.map(this.createNavItem),
      _react2["default"].createElement(
        "button",
        {
          className: "btn btn-info primary-nav-debug-button",
          onClick: _DebugToolsEventBus2["default"].emitToggle.bind(_DebugToolsEventBus2["default"]) },
        "Toggle Debug Tools"
      )
    );
  }

});

module.exports = PrimaryNavigation;
/* TODO: Better content, from Flux store */
/* TODO: Better content, from Flux store */
//# sourceMappingURL=PrimaryNavigation.js.map