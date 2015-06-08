// FREENAS GUI ROUTES
// ==================

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

// Routing

var _reactRouter = require("react-router");

var _reactRouter2 = _interopRequireDefault(_reactRouter);

// STATIC ROUTES

var _viewsFreeNASWebApp = require("./views/FreeNASWebApp");

var _viewsFreeNASWebApp2 = _interopRequireDefault(_viewsFreeNASWebApp);

var _viewsPageNotFound = require("./views/PageNotFound");

var _viewsPageNotFound2 = _interopRequireDefault(_viewsPageNotFound);

var _viewsDashboard = require("./views/Dashboard");

var _viewsDashboard2 = _interopRequireDefault(_viewsDashboard);

var _viewsAccounts = require("./views/Accounts");

var _viewsAccounts2 = _interopRequireDefault(_viewsAccounts);

var _viewsAccountsUsers = require("./views/Accounts/Users");

var _viewsAccountsUsers2 = _interopRequireDefault(_viewsAccountsUsers);

var _viewsAccountsUsersUserItem = require("./views/Accounts/Users/UserItem");

var _viewsAccountsUsersUserItem2 = _interopRequireDefault(_viewsAccountsUsersUserItem);

var _viewsAccountsUsersAddUser = require("./views/Accounts/Users/AddUser");

var _viewsAccountsUsersAddUser2 = _interopRequireDefault(_viewsAccountsUsersAddUser);

var _viewsAccountsGroups = require("./views/Accounts/Groups");

var _viewsAccountsGroups2 = _interopRequireDefault(_viewsAccountsGroups);

var _viewsAccountsGroupsGroupItem = require("./views/Accounts/Groups/GroupItem");

var _viewsAccountsGroupsGroupItem2 = _interopRequireDefault(_viewsAccountsGroupsGroupItem);

var _viewsAccountsGroupsAddGroup = require("./views/Accounts/Groups/AddGroup");

var _viewsAccountsGroupsAddGroup2 = _interopRequireDefault(_viewsAccountsGroupsAddGroup);

var _viewsTasks = require("./views/Tasks");

var _viewsTasks2 = _interopRequireDefault(_viewsTasks);

var _viewsNetwork = require("./views/Network");

var _viewsNetwork2 = _interopRequireDefault(_viewsNetwork);

var _viewsNetworkInterfaces = require("./views/Network/Interfaces");

var _viewsNetworkInterfaces2 = _interopRequireDefault(_viewsNetworkInterfaces);

var _viewsNetworkInterfacesInterfaceItem = require("./views/Network/Interfaces/InterfaceItem");

var _viewsNetworkInterfacesInterfaceItem2 = _interopRequireDefault(_viewsNetworkInterfacesInterfaceItem);

var _viewsNetworkNetworkConfig = require("./views/Network/NetworkConfig");

var _viewsNetworkNetworkConfig2 = _interopRequireDefault(_viewsNetworkNetworkConfig);

var _viewsStorage = require("./views/Storage");

var _viewsStorage2 = _interopRequireDefault(_viewsStorage);

var _viewsStorageDisks = require("./views/Storage/Disks");

var _viewsStorageDisks2 = _interopRequireDefault(_viewsStorageDisks);

var _viewsSharing = require("./views/Sharing");

var _viewsSharing2 = _interopRequireDefault(_viewsSharing);

var _viewsServices = require("./views/Services");

var _viewsServices2 = _interopRequireDefault(_viewsServices);

var _viewsServicesServiceItem = require("./views/Services/ServiceItem");

var _viewsServicesServiceItem2 = _interopRequireDefault(_viewsServicesServiceItem);

var _viewsSystemTools = require("./views/SystemTools");

var _viewsSystemTools2 = _interopRequireDefault(_viewsSystemTools);

var _viewsControlPanel = require("./views/ControlPanel");

var _viewsControlPanel2 = _interopRequireDefault(_viewsControlPanel);

var _viewsPower = require("./views/Power");

var _viewsPower2 = _interopRequireDefault(_viewsPower);

var Route = _reactRouter2["default"].Route;
var Redirect = _reactRouter2["default"].Redirect;
var DefaultRoute = _reactRouter2["default"].DefaultRoute;
var NotFoundRoute = _reactRouter2["default"].NotFoundRoute;

module.exports = _react2["default"].createElement(
  Route,
  {
    path: "/",
    handler: _viewsFreeNASWebApp2["default"] },
  _react2["default"].createElement(DefaultRoute, { handler: _viewsDashboard2["default"] }),
  _react2["default"].createElement(Route, {
    name: "dashboard",
    route: "dashboard",
    handler: _viewsDashboard2["default"] }),
  _react2["default"].createElement(
    Route,
    {
      name: "accounts",
      path: "accounts",
      handler: _viewsAccounts2["default"] },
    _react2["default"].createElement(DefaultRoute, { handler: _viewsAccountsUsers2["default"] }),
    _react2["default"].createElement(
      Route,
      {
        name: "users",
        path: "users",
        handler: _viewsAccountsUsers2["default"] },
      _react2["default"].createElement(Route, {
        name: "add-user",
        path: "add-user",
        handler: _viewsAccountsUsersAddUser2["default"] }),
      _react2["default"].createElement(Route, {
        name: "users-editor",
        path: ":userID",
        handler: _viewsAccountsUsersUserItem2["default"] })
    ),
    _react2["default"].createElement(
      Route,
      {
        name: "groups",
        path: "groups",
        handler: _viewsAccountsGroups2["default"] },
      _react2["default"].createElement(Route, {
        name: "add-group",
        path: "add-group",
        handler: _viewsAccountsGroupsAddGroup2["default"] }),
      _react2["default"].createElement(Route, {
        name: "groups-editor",
        path: ":groupID",
        handler: _viewsAccountsGroupsGroupItem2["default"] })
    )
  ),
  _react2["default"].createElement(Route, {
    name: "tasks",
    route: "tasks",
    handler: _viewsTasks2["default"] }),
  _react2["default"].createElement(
    Route,
    {
      name: "network",
      path: "network",
      handler: _viewsNetwork2["default"] },
    _react2["default"].createElement(Route, {
      name: "network-config",
      path: "network-config",
      handler: _viewsNetworkNetworkConfig2["default"] }),
    _react2["default"].createElement(
      Route,
      {
        name: "interfaces",
        path: "interfaces",
        handler: _viewsNetworkInterfaces2["default"] },
      _react2["default"].createElement(Route, {
        name: "interfaces-editor",
        path: ":interfaceID",
        handler: _viewsNetworkInterfacesInterfaceItem2["default"] })
    )
  ),
  _react2["default"].createElement(
    Route,
    {
      name: "storage",
      route: "storage",
      handler: _viewsStorage2["default"] },
    _react2["default"].createElement(Route, {
      name: "disks",
      route: "disks",
      handler: _viewsStorageDisks2["default"] })
  ),
  _react2["default"].createElement(Route, {
    name: "sharing",
    route: "sharing",
    handler: _viewsSharing2["default"] }),
  _react2["default"].createElement(
    Route,
    {
      name: "services",
      route: "services",
      handler: _viewsServices2["default"] },
    _react2["default"].createElement(Route, {
      name: "services-editor",
      path: ":serviceID",
      handler: _viewsServicesServiceItem2["default"] })
  ),
  _react2["default"].createElement(Route, {
    name: "system-tools",
    route: "system-tools",
    handler: _viewsSystemTools2["default"] }),
  _react2["default"].createElement(Route, {
    name: "control-panel",
    route: "control-panel",
    handler: _viewsControlPanel2["default"] }),
  _react2["default"].createElement(Route, {
    name: "power",
    route: "power",
    handler: _viewsPower2["default"] }),
  _react2["default"].createElement(NotFoundRoute, { handler: _viewsDashboard2["default"] })
);
/* ACCOUNTS */ /* USERS */ /* GROUPS */ /* TASKS */ /* NETWORK */ /* GLOBAL NETWORK CONFIGURATION */ /* NETWORK INTERFACES */ /* STORAGE */ /* SHARING */ /* SERVICES */ /* SYSTEM TOOLS */ /* CONTROL PANEL */ /* POWER */
//# sourceMappingURL=routes.js.map
