'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;
  var firstName = data.firstName,
      lastName = data.lastName,
      email = data.email,
      message = data.message,
      phoneNumber = data.phoneNumber;

  return _react2.default.createElement(
    'dl',
    null,
    _react2.default.createElement(
      'dt',
      null,
      'First Name'
    ),
    _react2.default.createElement(
      'dd',
      null,
      firstName
    ),
    _react2.default.createElement(
      'dt',
      null,
      'Last Name'
    ),
    _react2.default.createElement(
      'dd',
      null,
      lastName
    ),
    _react2.default.createElement(
      'dt',
      null,
      'Email Address'
    ),
    _react2.default.createElement(
      'dd',
      null,
      email
    ),
    _react2.default.createElement(
      'dt',
      null,
      'Phone Number'
    ),
    _react2.default.createElement(
      'dd',
      null,
      phoneNumber
    ),
    _react2.default.createElement(
      'dt',
      null,
      'Message'
    ),
    _react2.default.createElement(
      'dd',
      null,
      message
    )
  );
};