// Tasks Tab
// =========

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

// Middleware

var _middlewareMiddlewareClient = require("../../middleware/MiddlewareClient");

var _middlewareMiddlewareClient2 = _interopRequireDefault(_middlewareMiddlewareClient);

var _storesTasksStore = require("../../stores/TasksStore");

var _storesTasksStore2 = _interopRequireDefault(_storesTasksStore);

var _middlewareTasksMiddleware = require("../../middleware/TasksMiddleware");

var _middlewareTasksMiddleware2 = _interopRequireDefault(_middlewareTasksMiddleware);

var componentLongName = "Debug Tools - Tasks Tab";

var TasksSection = _react2["default"].createClass({
  displayName: "TasksSection",

  propTypes: {
    tasks: _react2["default"].PropTypes.object.isRequired,
    showProgress: _react2["default"].PropTypes.bool,
    canCancel: _react2["default"].PropTypes.bool
  },

  createTask: function createTask(taskID, index) {
    var taskData = this.props.tasks[taskID];
    var taskName = null;
    var progress = null;
    var cancelBtn = null;
    var started = taskData["started_at"] ? _moment2["default"].unix(taskData["started_at"]).format("YYYY-MM-DD HH:mm:ss") : "--";
    var finished = taskData["finished_at"] ? _moment2["default"].unix(taskData["finished_at"]).format("YYYY-MM-DD HH:mm:ss") : "--";
    var abortable = false;

    if (typeof this.props.canCancel === "undefined" && taskData["abortable"]) {
      abortable = true;
    }

    if (_lodash2["default"].has(taskData, "name")) {
      taskName = _react2["default"].createElement(
        "h5",
        { className: "debug-task-title" },
        taskData["name"]
      );
    }

    if (this.props.showProgress) {
      var progressprops = {};
      progressprops.now = taskData["percentage"];
      progressprops.bsStyle = "info";
      progressprops.label = "%(percent)s%";
      switch (taskData["state"]) {
        case "WAITING":
          progressprops.active = true;
          progressprops.now = 100;
          progressprops.label = "Waiting...";
          break;
        case "FINISHED":
          progressprops.bsStyle = "success";
          progressprops.label = "Completed";
          break;
        case "FAILED":
          progressprops.bsStyle = "danger";
          progressprops.label = "Failed";
          break;
        case "ABORTED":
          progressprops.bsStyle = "warning";
          progressprops.label = "Aborted";
          break;
      }
      progress = _react2["default"].createElement(_reactBootstrap2["default"].ProgressBar, progressprops);
    }

    this.callAbort = function () {
      _middlewareTasksMiddleware2["default"].abortTask(taskID);
    };

    if (this.props.canCancel || abortable) {
      cancelBtn = _react2["default"].createElement(
        _reactBootstrap2["default"].Button,
        {
          bsSize: "small",
          className: "debug-task-abort",
          bsStyle: "danger",
          onClick: this.callAbort },
        "Abort Task"
      );
    }

    return _react2["default"].createElement(
      "div",
      {
        className: "debug-task-item",
        key: index },
      _react2["default"].createElement(
        "div",
        { className: "debug-task-id" },
        taskID
      ),
      _react2["default"].createElement(
        "div",
        { className: "debug-task-details" },
        taskName,
        _react2["default"].createElement(
          "div",
          { className: "clearfix" },
          _react2["default"].createElement(
            "h6",
            { className: "debug-task-timestamp" },
            "Task Started: " + started
          ),
          _react2["default"].createElement(
            "h6",
            { className: "debug-task-timestamp" },
            "Task Finished: " + finished
          )
        ),
        _react2["default"].createElement("hr", null),
        _react2["default"].createElement(
          "div",
          { className: "clearfix" },
          cancelBtn,
          progress
        )
      )
    );
  },
  render: function render() {
    var taskIDs = _lodash2["default"].sortBy(_lodash2["default"].keys(this.props.tasks), ["id"]).reverse();
    return _react2["default"].createElement(
      "div",
      { className: "debug-column-content" },
      taskIDs.map(this.createTask)
    );
  }

});

var Tasks = _react2["default"].createClass({
  displayName: "Tasks",

  getInitialState: function getInitialState() {
    return {
      tasks: _lodash2["default"].assign({}, _storesTasksStore2["default"].getAllTasks()),
      taskMethodValue: "",
      argsValue: "[]"
    };
  },

  init: function init(tasks) {
    var histFinished = {};
    var histFailed = {};
    var histAborted = {};

    tasks.forEach(function (task) {
      switch (task["state"]) {
        case "FINISHED":
          histFinished[task["id"]] = task;
          histFinished[task["id"]]["percentage"] = 100;
          break;
        case "FAILED":
          histFailed[task["id"]] = task;
          histFailed[task["id"]]["percentage"] = task["percentage"] ? task["percentage"] : 50;
          break;
        case "ABORTED":
          histAborted[task["id"]] = task;
          histAborted[task["id"]]["percentage"] = task["percentage"] ? task["percentage"] : 50;
          break;
      }
    });

    this.setState({
      tasks: _lodash2["default"].merge({}, { "FINISHED": histFinished }, { "FAILED": histFailed }, { "ABORTED": histAborted }, _storesTasksStore2["default"].getAllTasks())
    });
  },

  componentDidMount: function componentDidMount() {
    _storesTasksStore2["default"].addChangeListener(this.handleMiddlewareChange);
    _middlewareMiddlewareClient2["default"].subscribe(["task.*"], componentLongName);

    var totalLength = 0;

    _lodash2["default"].forEach(this.state.tasks, function (category, index) {
      totalLength += _lodash2["default"].keys(this.state.tasks[category]).length;
    }, this);

    _middlewareTasksMiddleware2["default"].getCompletedTaskHistory(this.init, totalLength);
  },

  componentWillUnmount: function componentWillUnmount() {
    _storesTasksStore2["default"].removeChangeListener(this.handleMiddlewareChange);
    _middlewareMiddlewareClient2["default"].unsubscribe(["task.*"], componentLongName);
  },

  handleMiddlewareChange: function handleMiddlewareChange() {
    this.setState({
      tasks: _lodash2["default"].merge({}, { "FINISHED": this.state.tasks["FINISHED"] }, { "FAILED": this.state.tasks["FAILED"] }, { "ABORTED": this.state.tasks["ABORTED"] }, _storesTasksStore2["default"].getAllTasks())
    });
  },

  handleMethodInputChange: function handleMethodInputChange(event) {
    this.setState({
      taskMethodValue: event.target.value
    });
  },

  handleArgsInputChange: function handleArgsInputChange(event) {
    this.setState({
      argsValue: event.target.value
    });
  },

  handleTaskSubmit: function handleTaskSubmit() {
    var taskAgg = [String(this.state.taskMethodValue)].concat(JSON.parse(this.state.argsValue));
    _middlewareMiddlewareClient2["default"].request("task.submit", taskAgg);
  },

  render: function render() {
    return _react2["default"].createElement(
      "div",
      { className: "debug-content-flex-wrapper" },
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Schedule Task"
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 5 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "text",
              placeholder: "Task Name",
              onChange: this.handleMethodInputChange,
              value: this.state.taskMethodValue })
          )
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 5 },
            _react2["default"].createElement(_reactBootstrap2["default"].Input, { type: "textarea",
              style: { resize: "vertical", height: "100px" },
              placeholder: "Arguments (JSON Array)",
              onChange: this.handleArgsInputChange,
              value: this.state.argsValue })
          )
        ),
        _react2["default"].createElement(
          _reactBootstrap2["default"].Row,
          null,
          _react2["default"].createElement(
            _reactBootstrap2["default"].Col,
            { xs: 5 },
            _react2["default"].createElement(
              _reactBootstrap2["default"].Button,
              { bsStyle: "primary",
                onClick: this.handleTaskSubmit,
                block: true },
              "Submit"
            )
          )
        )
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Created Tasks (" + _lodash2["default"].keys(this.state.tasks["CREATED"]).length + ")"
        ),
        _react2["default"].createElement(TasksSection, {
          tasks: this.state.tasks["CREATED"], canCancel: true }),
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Waiting Tasks (" + _lodash2["default"].keys(this.state.tasks["WAITING"]).length + ")"
        ),
        _react2["default"].createElement(TasksSection, {
          tasks: this.state.tasks["WAITING"], showProgress: true, canCancel: true }),
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Executing Tasks (" + _lodash2["default"].keys(this.state.tasks["EXECUTING"]).length + ")"
        ),
        _react2["default"].createElement(TasksSection, {
          tasks: this.state.tasks["EXECUTING"], showProgress: true })
      ),
      _react2["default"].createElement(
        _reactBootstrap2["default"].Col,
        { xs: 6, className: "debug-column" },
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Finished Task History"
        ),
        _react2["default"].createElement(TasksSection, {
          tasks: this.state.tasks["FINISHED"], showProgress: true, canCancel: false }),
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Failed Task History"
        ),
        _react2["default"].createElement(TasksSection, {
          tasks: this.state.tasks["FAILED"], showProgress: true, canCancel: false }),
        _react2["default"].createElement(
          "h5",
          { className: "debug-heading" },
          "Aborted Task History"
        ),
        _react2["default"].createElement(TasksSection, {
          tasks: this.state.tasks["ABORTED"], showProgress: true, canCancel: false })
      )
    );
  }

});

module.exports = Tasks;
//# sourceMappingURL=Tasks.js.map