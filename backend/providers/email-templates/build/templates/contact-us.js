"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;
  return _react2.default.createElement(
    "dl",
    null,
    _react2.default.createElement(
      "dt",
      null,
      "First Name"
    ),
    _react2.default.createElement(
      "dd",
      null,
      data.firstName
    ),
    _react2.default.createElement(
      "dt",
      null,
      "Last Name"
    ),
    _react2.default.createElement(
      "dd",
      null,
      data.lastName
    ),
    _react2.default.createElement(
      "dt",
      null,
      "Email Address"
    ),
    _react2.default.createElement(
      "dd",
      null,
      data.emailAddress
    ),
    _react2.default.createElement(
      "dt",
      null,
      "Phone Number"
    ),
    _react2.default.createElement(
      "dd",
      null,
      data.phoneNumber
    ),
    _react2.default.createElement(
      "dt",
      null,
      "Message"
    ),
    _react2.default.createElement(
      "dd",
      null,
      data.message
    )
  );
};