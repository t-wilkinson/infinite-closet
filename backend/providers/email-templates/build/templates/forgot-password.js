'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;

  return _react2.default.createElement(
    'div',
    {
      style: {
        padding: '1em 2em'
      }
    },
    _react2.default.createElement(
      'p',
      null,
      'We heard that you lost your password. Sorry about that!'
    ),
    _react2.default.createElement(
      'p',
      null,
      'But don\u2019t worry! You can use the following link to reset your password:'
    ),
    _react2.default.createElement(
      'p',
      null,
      data.url
    ),
    _react2.default.createElement(
      'p',
      null,
      'Thanks.'
    )
  );
};