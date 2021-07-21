'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _layout2 = _interopRequireDefault(_layout);

var _Order = require('../elements/Order');

var _Order2 = _interopRequireDefault(_Order);

var _dayjs = require('dayjs');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _utc = require('dayjs/plugin/utc');

var _utc2 = _interopRequireDefault(_utc);

var _timezone = require('dayjs/plugin/timezone');

var _timezone2 = _interopRequireDefault(_timezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dayjs2.default.extend(_utc2.default);
_dayjs2.default.extend(_timezone2.default);

exports.default = function (_ref) {
  var data = _ref.data;

  var formatDate = function formatDate(date) {
    return (0, _dayjs2.default)(date).tz('Europe/London').format('dddd, MMM D');
  };

  return _react2.default.createElement(
    _layout2.default,
    { title: 'Order Arriving' },
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
      'Your order is arriving today!'
    ),
    _react2.default.createElement(_Order2.default, data),
    _react2.default.createElement(
      'span',
      null,
      'Please expect the order to be picked up on',
      ' ',
      _react2.default.createElement(
        'span',
        { style: { color: '#39603d' } },
        formatDate(data.range.end)
      ),
      '.'
    )
  );
};