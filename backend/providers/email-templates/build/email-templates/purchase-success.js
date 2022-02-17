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
  var firstName = data.firstName;

  return _react2.default.createElement(
    _layout.Layout,
    {
      title: 'Purchase success'
    },
    _react2.default.createElement(_components.Space, { n: 1 }),
    _react2.default.createElement(_components.Separator, null),
    _react2.default.createElement(
      _layout.P,
      null,
      _react2.default.createElement(
        'p',
        null,
        'Hello ',
        firstName,
        ','
      )
    ),
    _react2.default.createElement(_components.Space, { n: 5 }),
    _react2.default.createElement(
      _components.Heading,
      null,
      'Thank you for your purchase!'
    ),
    _react2.default.createElement(_components.Space, { n: 5 })
  );
};