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
      title: 'Return Received',
      img: '/media/photoshoot/blue-dress-mirror.png',
      separator: true
    },
    _react2.default.createElement(
      _layout.P,
      null,
      _react2.default.createElement(
        'p',
        null,
        'Hello ',
        firstName,
        ','
      ),
      _react2.default.createElement(
        'p',
        null,
        'Your rentals have been recieved. We will check your items and let you know if there are any issues.'
      ),
      _react2.default.createElement(
        'p',
        null,
        'Thanks again for shopping with us!'
      )
    ),
    _react2.default.createElement(_components.Space, { n: 2 }),
    _react2.default.createElement(_components.ReviewRequest, null),
    _react2.default.createElement(_components.Space, { n: 1 })
  );
};