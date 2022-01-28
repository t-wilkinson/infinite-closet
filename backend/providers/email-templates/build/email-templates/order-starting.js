'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _layout2 = _interopRequireDefault(_layout);

var _Order = require('../components/Order');

var _Order2 = _interopRequireDefault(_Order);

var _date = require('../utils/date');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;
  var firstName = data.firstName,
      cartItem = data.cartItem;


  return _react2.default.createElement(
    _layout2.default,
    { title: 'Order Arriving' },
    _react2.default.createElement(
      'h3',
      { style: { margin: 0 } },
      'Hello ',
      firstName,
      ','
    ),
    _react2.default.createElement(
      'span',
      null,
      'Your order is arriving today!'
    ),
    _react2.default.createElement('br', null),
    _react2.default.createElement(_Order2.default, cartItem),
    _react2.default.createElement(
      'span',
      null,
      'Please expect the order to be picked up on',
      ' ',
      _react2.default.createElement(
        'span',
        { style: { color: '#39603d' } },
        (0, _date.fmtDate)(cartItem.range.end)
      ),
      '.'
    )
  );
};