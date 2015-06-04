// Copyright (c) 2013, Peter Ruibal <ruibalp@gmail.com>

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.
//
// Generic Fuzzy Search TypeAhead React Component
// ===============================
// Taken (and Modified) from : https://github.com/fmoo/react-typeahead

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _fuzzy = require("fuzzy");

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

/**
 * PolyFills make me(The author Peter Ruibal) sad
 */
var KeyEvent = KeyEvent || {};
KeyEvent.DOM_VK_UP = KeyEvent.DOM_VK_UP || 38;
KeyEvent.DOM_VK_DOWN = KeyEvent.DOM_VK_DOWN || 40;
KeyEvent.DOM_VK_BACK_SPACE = KeyEvent.DOM_VK_BACK_SPACE || 8;
KeyEvent.DOM_VK_RETURN = KeyEvent.DOM_VK_RETURN || 13;
KeyEvent.DOM_VK_ENTER = KeyEvent.DOM_VK_ENTER || 14;
KeyEvent.DOM_VK_ESCAPE = KeyEvent.DOM_VK_ESCAPE || 27;
KeyEvent.DOM_VK_TAB = KeyEvent.DOM_VK_TAB || 9;

/**
 * A single option within the TypeaheadSelector
 */
var TypeaheadOption = _react2["default"].createClass({
  displayName: "TypeaheadOption",
  propTypes: { customClasses: _react2["default"].PropTypes.object,
    customValue: _react2["default"].PropTypes.string,
    onClick: _react2["default"].PropTypes.func,
    children: _react2["default"].PropTypes.string,
    hover: _react2["default"].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return { customClasses: {},
      onClick: function onClick(event) {
        event.preventDefault();
      }
    };
  },

  getInitialState: function getInitialState() {
    return {};
  },

  _onClick: function _onClick(event) {
    event.preventDefault();
    return this.props.onClick(event);
  },

  _getClasses: function _getClasses() {
    var classes = {
      "typeahead-option": true
    };
    classes[this.props.customClasses.listAnchor] = !!this.props.customClasses.listAnchor;

    return (0, _classnames2["default"])(classes);
  },

  render: function render() {
    var classes = {};
    classes[this.props.customClasses.hover || "hover"] = !!this.props.hover;
    classes[this.props.customClasses.listItem] = !!this.props.customClasses.listItem;

    if (this.props.customValue) {
      classes[this.props.customClasses.customAdd] = !!this.props.customClasses.customAdd;
    }

    var classList = (0, _classnames2["default"])(classes);

    return _react2["default"].createElement(
      "li",
      { className: classList, onClick: this._onClick },
      _react2["default"].createElement(
        "a",
        { href: "javascript: void 0;",
          className: this._getClasses(), ref: "anchor" },
        this.props.children
      )
    );
  }
});

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */
var TypeaheadSelector = _react2["default"].createClass({
  displayName: "TypeaheadSelector",
  propTypes: { options: _react2["default"].PropTypes.array,
    customClasses: _react2["default"].PropTypes.object,
    customValue: _react2["default"].PropTypes.string,
    selectionIndex: _react2["default"].PropTypes.number,
    onOptionSelected: _react2["default"].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return { selectionIndex: null,
      customClasses: {},
      customValue: null,
      onOptionSelected: function onOptionSelected(option) {}
    };
  },

  getInitialState: function getInitialState() {
    return { selectionIndex: this.props.selectionIndex,
      selection: this.getSelectionForIndex(this.props.selectionIndex)
    };
  },

  setSelectionIndex: function setSelectionIndex(index) {
    this.setState({ selectionIndex: index,
      selection: this.getSelectionForIndex(index)
    });
  },

  getSelectionForIndex: function getSelectionForIndex(index) {
    if (index === null) {
      return null;
    }
    if (index === 0 && this.props.customValue !== null) {
      return this.props.customValue;
    }

    if (this.props.customValue !== null) {
      index -= 1;
    }

    return this.props.options[index];
  },

  _onClick: function _onClick(result, event) {
    return this.props.onOptionSelected(result, event);
  },

  _nav: function _nav(delta) {
    if (!this.props.options && this.props.customValue === null) {
      return;
    }
    var newIndex = this.state.selectionIndex === null ? delta === 1 ? 0 : delta : this.state.selectionIndex + delta;
    var length = this.props.options.length;
    if (this.props.customValue !== null) {
      length += 1;
    }

    if (newIndex < 0) {
      newIndex += length;
    } else if (newIndex >= length) {
      newIndex -= length;
    }

    var newSelection = this.getSelectionForIndex(newIndex);
    this.setState({ selectionIndex: newIndex,
      selection: newSelection });
  },

  navDown: function navDown() {
    this._nav(1);
  },

  navUp: function navUp() {
    this._nav(-1);
  },

  render: function render() {
    var classes = { "typeahead-selector": true };
    classes[this.props.customClasses.results] = this.props.customClasses.results;
    var classList = (0, _classnames2["default"])(classes);

    var results = [];
    // CustomValue should be added to top of results
    // list with different class name
    if (this.props.customValue !== null) {
      results.push(_react2["default"].createElement(
        TypeaheadOption,
        { ref: this.props.customValue,
          key: this.props.customValue,
          hover: this.state.selectionIndex === results.length,
          customClasses: this.props.customClasses,
          customValue: this.props.customValue,
          onClick: this._onClick.bind(this, this.props.customValue) },
        this.props.customValue
      ));
    }

    this.props.options.forEach(function (result, i) {
      results.push(_react2["default"].createElement(
        TypeaheadOption,
        {
          ref: result, key: result,
          hover: this.state.selectionIndex === results.length,
          customClasses: this.props.customClasses,
          onClick: this._onClick.bind(this, result) },
        result
      ));
    }, this);

    return _react2["default"].createElement(
      "ul",
      { className: classList },
      results
    );
  }

});

/**
 * A "typeahead", an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.  Requires CSS for MASSIVE DAMAGE.
 */
var FuzzyTypeAhead = _react2["default"].createClass({
  displayName: "FuzzyTypeAhead",
  propTypes: { name: _react2["default"].PropTypes.string,
    customClasses: _react2["default"].PropTypes.object,
    maxVisible: _react2["default"].PropTypes.number,
    options: _react2["default"].PropTypes.array,
    allowCustomValues: _react2["default"].PropTypes.number,
    defaultValue: _react2["default"].PropTypes.string,
    placeholder: _react2["default"].PropTypes.string,
    onOptionSelected: _react2["default"].PropTypes.func,
    onKeyDown: _react2["default"].PropTypes.func,
    filterOption: _react2["default"].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return { options: [],
      customClasses: {},
      allowCustomValues: 0,
      defaultValue: "",
      placeholder: "",
      onOptionSelected: function onOptionSelected(option) {},
      onKeyDown: function onKeyDown(event) {},
      filterOption: null
    };
  },

  getInitialState: function getInitialState() {
    return { visible: this.getOptionsForValue(this.props.defaultValue, this.props.options)
      // ^^ The currently visible set of options
      , entryValue: this.props.defaultValue
      // ^^ This should be called something else, "entryValue"
      , selection: null
      // ^^ A valid typeahead value
    };
  },

  getOptionsForValue: function getOptionsForValue(value, options) {
    var result;
    if (this.props.filterOption) {
      result = options.filter((function (o) {
        return this.props.filterOption(value, o);
      }).bind(this));
    } else {
      result = _fuzzy2["default"].filter(value, options).map(function (res) {
        return res.string;
      });
    }
    if (this.props.maxVisible) {
      result = result.slice(0, this.props.maxVisible);
    }
    return result;
  },

  _hasCustomValue: function _hasCustomValue() {
    if (this.props.allowCustomValues > 0 && this.state.entryValue.length >= this.props.allowCustomValues && this.state.visible.indexOf(this.state.entryValue) < 0) {
      return true;
    }
    return false;
  },

  _getCustomValue: function _getCustomValue() {
    if (this._hasCustomValue()) {
      return this.state.entryValue;
    }
    return null;
  },

  _renderIncrementalSearchResults: function _renderIncrementalSearchResults() {
    // Nothing has been entered into the textbox
    if (!this.state.entryValue) {
      return "";
    }

    // Something was just selected
    if (this.state.selection) {
      return "";
    }

    // There are no typeahead / autocomplete suggestions
    if (!this.state.visible.length && !(this.props.allowCustomValues > 0)) {
      return "";
    }

    // There is only one typeahead result and it matches the entryValue
    // (mathces in the sense that it exactly matches and not fuzzy! )
    // In this case we would not want the typeahead to show anymore!
    if (this.state.visible.length === 1 && this.state.visible[0] === this.state.entryValue) {
      return "";
    }

    if (this._hasCustomValue()) {
      return _react2["default"].createElement(TypeaheadSelector, {
        ref: "sel", options: this.state.visible,
        customValue: this.state.entryValue,
        onOptionSelected: this._onOptionSelected,
        customClasses: this.props.customClasses });
    }

    return _react2["default"].createElement(TypeaheadSelector, {
      ref: "sel", options: this.state.visible,
      onOptionSelected: this._onOptionSelected,
      customClasses: this.props.customClasses });
  },

  _onOptionSelected: function _onOptionSelected(option, event) {
    var nEntry = _react2["default"].findDOMNode(this.refs.entry);
    nEntry.focus();
    nEntry.value = option;
    this.setState({ visible: this.getOptionsForValue(option, this.props.options),
      selection: option,
      entryValue: option });
    return this.props.onOptionSelected(option, event);
  },

  _onTextEntryUpdated: function _onTextEntryUpdated(event) {
    var value = event.target.value;
    this.setState({ visible: this.getOptionsForValue(value, this.props.options),
      selection: null,
      entryValue: value });
  },

  _onEnter: function _onEnter(event) {
    if (!this.refs.sel.state.selection) {
      return this.props.onKeyDown(event);
    }
    return this._onOptionSelected(this.refs.sel.state.selection, event);
  },

  _onEscape: function _onEscape() {
    this.refs.sel.setSelectionIndex(null);
  },

  _onTab: function _onTab(event) {
    var option = this.refs.sel.state.selection ? this.refs.sel.state.selection : this.state.visible.length > 0 ? this.state.visible[0] : null;

    if (option === null && this._hasCustomValue()) {
      option = this._getCustomValue();
    }

    if (option !== null) {
      return this._onOptionSelected(option, event);
    }
  },

  eventMap: function eventMap(event) {
    var events = {};

    events[KeyEvent.DOM_VK_UP] = this.refs.sel.navUp;
    events[KeyEvent.DOM_VK_DOWN] = this.refs.sel.navDown;
    events[KeyEvent.DOM_VK_RETURN] = events[KeyEvent.DOM_VK_ENTER] = this._onEnter;
    events[KeyEvent.DOM_VK_ESCAPE] = this._onEscape;
    events[KeyEvent.DOM_VK_TAB] = this._onTab;

    return events;
  },

  _onKeyDown: function _onKeyDown(event) {
    // If there are no visible elements, don't perform selector navigation.
    // Just pass this up to the upstream onKeydown handler
    if (!this.refs.sel) {
      return this.props.onKeyDown(event);
    }

    var handler = this.eventMap()[event.keyCode];

    if (handler) {
      handler(event);
    } else {
      return this.props.onKeyDown(event);
    }
    // Don't propagate the keystroke back to the DOM/browser
    event.preventDefault();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      var value = nextProps.defaultValue;
      this.setState({ entryValue: value,
        visible: this.getOptionsForValue(value, nextProps.options)
      });
    }
  }

  // Uncomment this if need be
  // , componentDidUpdate: function ( prevProps, prevState ) {
  //   }

  , _renderHiddenInput: function _renderHiddenInput() {
    if (!this.props.name) {
      return null;
    }

    return _react2["default"].createElement("input", {
      type: "hidden",
      name: this.props.name,
      value: this.state.selection
    });
  },

  render: function render() {
    var inputClasses = {};
    inputClasses[this.props.customClasses.input] = !!this.props.customClasses.input;
    var inputClassList = (0, _classnames2["default"])(inputClasses);

    var classes = { typeahead: true };
    classes[this.props.className] = !!this.props.className;
    var classList = (0, _classnames2["default"])(classes);

    return _react2["default"].createElement(
      "div",
      { className: classList },
      this._renderHiddenInput(),
      _react2["default"].createElement(_reactBootstrap2["default"].Input, {
        ref: "entry",
        type: "text",
        placeholder: this.props.placeholder,
        className: inputClassList,
        value: this.state.entryValue,
        onChange: this._onTextEntryUpdated,
        onKeyDown: this._onKeyDown }),
      this._renderIncrementalSearchResults()
    );
  }

});

module.exports = FuzzyTypeAhead;
//# sourceMappingURL=FuzzyTypeAhead.js.map