// Interface Item
// ==============
// Handles viewing and and changing of network interfaces.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _componentsMixinsRouterShim = require("../../../components/mixins/routerShim");

var _componentsMixinsRouterShim2 = _interopRequireDefault(_componentsMixinsRouterShim);

var _componentsMixinsClientStatus = require("../../../components/mixins/clientStatus");

var _componentsMixinsClientStatus2 = _interopRequireDefault(_componentsMixinsClientStatus);

var _componentsViewerViewerUtil = require("../../../components/Viewer/viewerUtil");

var _componentsViewerViewerUtil2 = _interopRequireDefault(_componentsViewerViewerUtil);

var _storesInterfacesStore = require("../../../stores/InterfacesStore");

var _storesInterfacesStore2 = _interopRequireDefault(_storesInterfacesStore);

var _componentsIcon = require("../../../components/Icon");

var _componentsIcon2 = _interopRequireDefault(_componentsIcon);

var _InterfaceEdit = require("./InterfaceEdit");

var _InterfaceEdit2 = _interopRequireDefault(_InterfaceEdit);

var InterfaceView = _react2["default"].createClass({
  displayName: "InterfaceView",

  propTypes: {
    item: _react2["default"].PropTypes.object.isRequired
  }

  // Map an array of aliases into an array of ListGroupItems representing all
  // aliases of 'family' (ie INET, INET6). Not providing a family will  map all
  // the aliases.
  , createAliasDisplayList: function createAliasDisplayList(family) {
    var aliasDisplayItems = null;

    // Only do anything if the interface exists and there are any aliases.
    // The first check should never fail, but I've said that before and
    // regretted it.
    if (!_lodash2["default"].isEmpty(this.props.item) && !_lodash2["default"].isEmpty(this.props.item.status)) {
      aliasDisplayItems = _lodash2["default"].map(this.props.item.status.aliases, function mapAliasesToList(alias, key) {

        // Only return items for aliases matching the given family.
        if (family === "INET" && alias.family === "INET") {
          return this.createAliasDisplayItem(alias);
        } else if (family === "INET6" && alias.family === "INET6") {
          return this.createAliasDisplayItem(alias);
          // If no family was specified or the family was unrecognized,
          // create a list item for every alias. This item is different
          // because we can't make certain assumptions.
        } else if (family !== "INET" && family !== "INET6") {
          return _react2["default"].createElement(
            _reactBootstrap2["default"].ListGroupItem,
            null,
            "Link Type: " + family,
            _react2["default"].createElement("br", null),
            _react2["default"].createElement("br", null),
            "Address: ",
            _react2["default"].createElement("br", null),
            _react2["default"].createElement(
              "strong",
              null,
              alias.address
            )
          );
        }
      }, this);
      return _lodash2["default"].compact(aliasDisplayItems);
    } else {
      return null;
    }
  }

  // Create the individual items for createAliasDisplayList.
  , createAliasDisplayItem: function createAliasDisplayItem(alias) {
    return _react2["default"].createElement(
      _reactBootstrap2["default"].ListGroupItem,
      { className: "aliasDisplayItem" },
      _react2["default"].createElement(
        "span",
        { className: "aliasItemIP" },
        _react2["default"].createElement(
          "strong",
          null,
          alias.address
        )
      ),
      _react2["default"].createElement(
        "span",
        { className: "aliasItemNetmask" },
        _react2["default"].createElement(
          "em",
          null,
          "/" + alias.netmask + " (" + alias.broadcast + ")"
        )
      )
    );
  },

  render: function render() {

    var configureButton = _react2["default"].createElement(
      _reactBootstrap2["default"].Row,
      null,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 12 },
        _react2["default"].createElement(
          _reactBootstrap2["default"].Button,
          {
            className: "pull-right",
            onClick: this.props.handleViewChange.bind(null, "edit"),
            bsStyle: "primary" },
          "Configure Interface"
        )
      )
    );

    var interfaceName = _react2["default"].createElement(
      _reactBootstrap2["default"].Panel,
      null,
      "Interface Name: ",
      _react2["default"].createElement(
        "strong",
        null,
        this.props.item["name"]
      )
    );

    var linkState = _react2["default"].createElement(
      _reactBootstrap2["default"].Panel,
      null,
      "Link State: ",
      _react2["default"].createElement(
        "strong",
        null,
        this.props.item["link_state"]
      )
    );

    var dhcpConfigured = _react2["default"].createElement(
      _reactBootstrap2["default"].Panel,
      null,
      "DHCP Configured: ",
      _react2["default"].createElement(_componentsIcon2["default"], { glyph: this.props.item["dhcp"] ? "check text-primary" : "times text-muted" })
    );

    var interfaceType = _react2["default"].createElement(
      _reactBootstrap2["default"].Panel,
      null,
      "Interface Type: ",
      _react2["default"].createElement(
        "strong",
        null,
        this.props.item["type"]
      )
    );

    return _react2["default"].createElement(
      _reactBootstrap2["default"].Grid,
      { fluid: true },
      configureButton,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Row,
        null,
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 6 },
          interfaceName
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 6 },
          linkState
        )
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Row,
        null,
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 6 },
          dhcpConfigured
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 6 },
          interfaceType
        )
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Row,
        null,
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 6 },
          _react2["default"].createElement(
            "h4",
            null,
            "IPv4 Aliases"
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].PanelGroup,
            null,
            _react2["default"].createElement(
              _reactBootstrap2["default"].Panel,
              null,
              _react2["default"].createElement(
                _reactBootstrap2["default"].ListGroup,
                { fill: true, className: "aliasDisplayList" },
                this.createAliasDisplayList("INET")
              )
            )
          )
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Col,
          { xs: 6 },
          _react2["default"].createElement(
            "h4",
            null,
            "IPv6 Aliases"
          ),
          _react2["default"].createElement(
            _reactBootstrap2["default"].PanelGroup,
            null,
            _react2["default"].createElement(
              _reactBootstrap2["default"].Panel,
              null,
              _react2["default"].createElement(
                _reactBootstrap2["default"].ListGroup,
                { fill: true, className: "aliasDisplayList" },
                this.createAliasDisplayList("INET6")
              )
            )
          )
        )
      )
    );
  }

});

var InterfaceItem = _react2["default"].createClass({
  displayName: "InterfaceItem",

  propTypes: {
    viewData: _react2["default"].PropTypes.object.isRequired
  },

  mixins: [_componentsMixinsRouterShim2["default"], _componentsMixinsClientStatus2["default"]],

  getInitialState: function getInitialState() {
    return {
      targetInterface: this.getInterfaceFromStore(),
      currentMode: "view",
      activeRoute: this.getDynamicRoute()
    };
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var activeRoute = this.getDynamicRoute();

    if (activeRoute !== prevState.activeRoute) {
      this.setState({
        targetInterface: this.getInterfaceFromStore(),
        currentMode: "view",
        activeRoute: activeRoute
      });
    }
  },

  componentDidMount: function componentDidMount() {
    _storesInterfacesStore2["default"].addChangeListener(this.updateInterfaceInState);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesInterfacesStore2["default"].removeChangeListener(this.updateInterfaceInState);
  },

  getInterfaceFromStore: function getInterfaceFromStore() {
    var format = this.props.viewData.format;
    return _storesInterfacesStore2["default"].findInterfaceByKeyValue(format["selectionKey"], this.getDynamicRoute());
  },

  updateInterfaceInState: function updateInterfaceInState() {
    this.setState({ targetInterface: this.getInterfaceFromStore() });
  },

  handleViewChange: function handleViewChange(nextMode, event) {
    this.setState({ currentMode: nextMode });
  },

  render: function render() {
    var DisplayComponent = null;

    if (this.state.SESSION_AUTHENTICATED && this.state.targetInterface) {
      var childProps = {
        handleViewChange: this.handleViewChange,
        item: this.state.targetInterface,
        viewData: this.props.viewData
      };

      switch (this.state.currentMode) {
        default:
        case "view":
          DisplayComponent = _react2["default"].createElement(InterfaceView, childProps);
          break;
        case "edit":
          DisplayComponent = _react2["default"].createElement(_InterfaceEdit2["default"], childProps);
          break;
      }
    }

    return _react2["default"].createElement(
      "div",
      { className: "viewer-item-info" },
      DisplayComponent
    );
  }

});

exports["default"] = InterfaceItem;
module.exports = exports["default"];
//# sourceMappingURL=InterfaceItem.js.map
