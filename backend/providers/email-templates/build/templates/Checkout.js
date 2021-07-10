'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Email = exports.fetchData = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _layout2 = _interopRequireDefault(_layout);

var _Order = require('../elements/Order');

var _Order2 = _interopRequireDefault(_Order);

var _data = require('../data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchData = exports.fetchData = function fetchData() {
  return _data2.default.Checkout;
};

var Email = exports.Email = function Email(_ref) {
  var data = _ref.data;

  return _react2.default.createElement(
    _layout2.default,
    { title: 'Checkout Confirmation' },
    _react2.default.createElement(
      'span',
      { className: 'font-bold text-xl' },
      'Hello ',
      data.name,
      ','
    ),
    _react2.default.createElement(
      'span',
      { className: 'mb-2' },
      'Thank you for your order.'
    ),
    _react2.default.createElement(
      'div',
      { className: 'my-4' },
      data.orders.map(function (order, i) {
        return _react2.default.createElement(
          _react2.default.Fragment,
          { key: i },
          i !== 0 && _react2.default.createElement('div', { className: 'w-full h-1 bg-white' }),
          _react2.default.createElement(_Order2.default, order)
        );
      })
    ),
    _react2.default.createElement(
      'span',
      null,
      'We hope to see you again soon.'
    )
  );
};