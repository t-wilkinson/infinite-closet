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

var _dayjs = require('dayjs');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _utc = require('dayjs/plugin/utc');

var _utc2 = _interopRequireDefault(_utc);

var _timezone = require('dayjs/plugin/timezone');

var _timezone2 = _interopRequireDefault(_timezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dayjs2.default.extend(_utc2.default);
_dayjs2.default.extend(_timezone2.default);

var fetchData = exports.fetchData = function fetchData() {
  return _data2.default.OrderArriving;
};

var Email = exports.Email = function Email(_ref) {
  var data = _ref.data;

  var formatDate = function formatDate(date) {
    return (0, _dayjs2.default)(date).tz('Europe/London').format('dddd, MMM D');
  };

  return _react2.default.createElement(
    _layout2.default,
    { title: 'Order Arriving' },
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
      'Your order is arriving midday today!'
    ),
    _react2.default.createElement(
      'div',
      { className: 'my-4' },
      _react2.default.createElement(_Order2.default, data)
    ),
    _react2.default.createElement(
      'span',
      null,
      'Please expect the order to be picked up on',
      ' ',
      _react2.default.createElement(
        'span',
        { className: 'text-sec' },
        formatDate(data.range.end)
      ),
      '.'
    )
  );
};