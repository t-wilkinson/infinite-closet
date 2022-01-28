'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _components = require('../components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;
  var url = data.url,
      user = data.user;

  return _react2.default.createElement(
    _layout.Layout,
    {
      title: 'Requested Password Reset',
      footer: false,
      img: '/media/photoshoot/blue-dress-mirror.png'
    },
    _react2.default.createElement(
      _layout.G,
      { cellPadding: 8 },
      _react2.default.createElement(
        _layout.P,
        null,
        _react2.default.createElement(
          'p',
          null,
          'Hello ',
          user.firstName,
          ','
        ),
        _react2.default.createElement(
          'p',
          null,
          'You have requested a password reset for your account. If this was not you, please ignore this email.'
        ),
        _react2.default.createElement(
          'p',
          null,
          'Use the link below to reset your password.'
        )
      ),
      _react2.default.createElement(
        _layout.G,
        { style: { textAlign: 'center' }, cellPadding: 48 },
        _react2.default.createElement(
          _components.ButtonLink,
          { href: url },
          'Reset Password'
        )
      )
    ),
    _react2.default.createElement(_layout.Legal, { color: '#5f6368', style: { fontSize: 14 } })
  );
};