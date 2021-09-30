'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Grid = require('../layout/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _layout = require('../layout');

var _layout2 = _interopRequireDefault(_layout);

var _Order = require('../elements/Order');

var _Order2 = _interopRequireDefault(_Order);

var _Between = require('../elements/Between');

var _Between2 = _interopRequireDefault(_Between);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;

  return _react2.default.createElement(
    _layout2.default,
    { title: 'Checkout Confirmation' },
    _react2.default.createElement(
      'h3',
      { style: { margin: 0 } },
      'Hello ',
      data.firstName,
      ','
    ),
    _react2.default.createElement(
      'span',
      null,
      'Thank you for your order.'
    ),
    _react2.default.createElement(
      _Grid2.default,
      { style: { marginTop: 8, marginBottom: 8 } },
      data.cart.map(function (item, i) {
        return _react2.default.createElement(_Order2.default, Object.assign({ key: i }, item));
      })
    ),
    _react2.default.createElement(_Between2.default, {
      left: _react2.default.createElement(
        'span',
        { style: { fontWeight: 700 } },
        'Total'
      ),
      right: _react2.default.createElement(
        'span',
        { style: { fontWeight: 700 } },
        '\xA3',
        data.totalPrice.toFixed(2)
      )
    }),
    _react2.default.createElement(
      'span',
      null,
      'We hope to see you again soon.'
    )
  );
};