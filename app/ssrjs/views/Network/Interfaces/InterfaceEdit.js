// Interface Edit View
// ===================

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

var _componentsMixinsViewerCommon = require("../../../components/mixins/viewerCommon");

var _componentsMixinsViewerCommon2 = _interopRequireDefault(_componentsMixinsViewerCommon);

var _componentsMixinsInputHelpers = require("../../../components/mixins/inputHelpers");

var _componentsMixinsInputHelpers2 = _interopRequireDefault(_componentsMixinsInputHelpers);

var _middlewareInterfacesMiddleware = require("../../../middleware/InterfacesMiddleware");

var _middlewareInterfacesMiddleware2 = _interopRequireDefault(_middlewareInterfacesMiddleware);

var InterfaceEdit = _react2["default"].createClass({
  displayName: "InterfaceEdit",

  mixins: [_componentsMixinsViewerCommon2["default"], _componentsMixinsInputHelpers2["default"]],

  contextTypes: { router: _react2["default"].PropTypes.func },

  propTypes: { item: _react2["default"].PropTypes.object.isRequired,
    viewData: _react2["default"].PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    var remoteState = this.setRemoteState(this.props);

    return { locallyModifiedValues: {},
      remotelyModifiedValues: {},
      remoteState: remoteState,
      mixedValues: this.props.item,
      lastSentValues: {}
    };
  }

  // Initially copied from UserEdit.
  // TODO: Eliminate this duplication if at all possible.
  , componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var newRemoteModified = {};
    var newLocallyModified = {};
    var dataKeys = nextProps.viewData["format"]["dataKeys"];

    // remotelyModifiedValues represents everything that's changed remotely
    // since the view was opened. This is the difference between the newly
    // arriving props and the initial ones. Read-only and unknown values are
    // ignored.
    // TODO: Use this to show alerts for remote changes on sections the local
    // administrator is working on.
    var mismatchedRemoteFields = _lodash2["default"].pick(nextProps.item, function checkMatch(value, key) {
      return _lodash2["default"].isEqual(this.state.remoteState[key], value);
    }, this);

    newRemoteModified = this.removeReadOnlyFields(mismatchedRemoteFields, dataKeys);

    // remoteState records the item as it was when the view was first
    // opened. This is used to mark changes that have occurred remotely since
    // the user began editing.
    // It is important to know if the incoming change resulted from a call
    // made by the local administrator. When this happens, we reset the
    // remoteState to get rid of remote edit markers, as the local version
    // has thus become authoritative.
    // We check this by comparing the incoming changes (newRemoteModified) to
    // the last request sent (this.state.lastSentValues). If this check
    // succeeds, we reset newLocallyModified and newRemoteModified, as there are
    // no longer any remote or local changes to record.
    // TODO: Do this in a deterministic way, instead of relying on comparing
    // values.
    if (_lodash2["default"].isEqual(this.state.lastSentValues, newRemoteModified)) {
      newRemoteModified = {};
      newLocallyModified = {};
      this.setState({ remoteState: this.setRemoteState(nextProps),
        locallyModifiedValues: newLocallyModified
      });
    }

    this.setState({ remotelyModifiedValues: newRemoteModified });
  },

  submitInterfaceConfigureTask: function submitInterfaceConfigureTask() {
    // Don't let read-only values in.
    var locallyModifiedValues = this.state.locallyModifiedValues;
    var mixedValues = this.state.mixedValues;

    var dataKeys = this.props.viewData["format"]["dataKeys"];
    var valuesToSend = this.removeReadOnlyFields(locallyModifiedValues, dataKeys);
    console.log("valuesToSend", valuesToSend);
    if (!_lodash2["default"].isEmpty(valuesToSend)) {
      _middlewareInterfacesMiddleware2["default"].configureInterface(this.props.item["name"], valuesToSend, this.submissionRedirect(valuesToSend));
      this.setState({ lastSentValues: valuesToSend });
    } else {
      console.warn("Attempted to sent an Interface Configure task" + " with no valid fields");
    }
  },

  render: function render() {
    var locallyModifiedValues = this.state.locallyModifiedValues;
    var mixedValues = this.state.mixedValues;

    var nameValue = mixedValues["name"] ? mixedValues["name"] : "";

    var mtuValue = mixedValues["mtu"] ? mixedValues["mtu"].toString() : "";

    var editButtons = _react2["default"].createElement(
      _reactBootstrap2["default"].ButtonToolbar,
      null,
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-right",
          onClick: this.props.handleViewChange.bind(null, "view"),
          bsStyle: "default" },
        "Cancel"
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        { className: "pull-right",
          disabled: _lodash2["default"].isEmpty(locallyModifiedValues) ? true : false,
          onClick: this.submitInterfaceConfigureTask,
          bsStyle: "info" },
        "Save Changes"
      )
    );

    var inputForm = _react2["default"].createElement(
      "form",
      { className: "form-horizontal" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Grid,
        { fluid: true },
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 12 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, {
              type: "text",
              label: "Interface Name",
              value: nameValue,
              onChange: this.editHandleValueChange.bind(null, "name"),
              ref: "name",
              key: "name",
              groupClassName: _lodash2["default"].has(locallyModifiedValues["name"] ? "editorWasModified" : ""),
              labelClassName: "col-xs-3",
              wrapperClassName: "col-xs-9"
            }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, {
              type: "checkbox",
              label: "DHCP Enabled",
              checked: mixedValues["dhcp"],
              onChange: this.editHandleValueChange.bind(null, "dhcp"),
              ref: "dhcp",
              key: "dhcp",
              groupClassName: _lodash2["default"].has(locallyModifiedValues["dhcp"] ? "editorWasModified" : ""),
              labelClassName: "col-xs-3",
              wrapperClassName: "col-xs-9"
            }),
            _react2["default"].createElement(_reactBootstrap2["default"].Input, {
              type: "checkbox",
              label: "Interface Enabled",
              checked: mixedValues["enabled"],
              onChange: this.editHandleValueChange.bind(null, "enabled"),
              ref: "enabled",
              key: "enabled",
              groupClassName: _lodash2["default"].has(locallyModifiedValues["enabled"] ? "editorWasModified" : ""),
              labelClassName: "col-xs-3",
              wrapperClassName: "col-xs-9"
            })
          )
        )
      )
    );

    return _react2["default"].createElement(
      "div",
      { className: "container-fluid" },
      editButtons,
      inputForm
    );
  }

});

exports["default"] = InterfaceEdit;
module.exports = exports["default"];
/*<TWBS.Button className = "pull-left"
               disabled = { this.props.item["builtin"] }
               onClick = { this.deleteGroup }
               bsStyle = "danger" >
    {"Delete Interface"}
  </TWBS.Button>*/ /* Interface Name */ /* DHCP */ /* enabled */ /* MTU - Hidden until safe validation can be performed.*/ /*<TWBS.Input
                                                                                                                               type = "text"
                                                                                                                               label = "MTU"
                                                                                                                               value = { mtuValue }
                                                                                                                               onChange = { this.editHandleValueChange.bind( null, "mtu" ) }
                                                                                                                               ref = { "mtu" }
                                                                                                                               key = { "mtu" }
                                                                                                                               groupClassName = { _.has( locallyModifiedValues[ "mtu" ]
                                                                                                                                                       ? "editorWasModified"
                                                                                                                                                       : ""
                                                                                                                                                       )
                                                                                                                                                }
                                                                                                                               labelClassName = "col-xs-3"
                                                                                                                               wrapperClassName = "col-xs-9"
                                                                                                                             />*/
//# sourceMappingURL=InterfaceEdit.js.map
