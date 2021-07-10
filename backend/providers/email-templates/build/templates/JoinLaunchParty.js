'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Email = exports.fetchData = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _layout2 = _interopRequireDefault(_layout);

var _Icon = require('../elements/Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _data = require('../data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchData = exports.fetchData = function fetchData() {
  return _data2.default.JoinLaunchParty;
};

var Summary = function Summary(_ref) {
  var TICKET_PRICE = _ref.TICKET_PRICE,
      discount = _ref.discount,
      donation = _ref.donation;

  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      'h3',
      { className: 'font-bold text-lg' },
      'Order Summary'
    ),
    _react2.default.createElement('div', { className: 'h-px w-full mb-4 bg-gray' }),
    _react2.default.createElement(
      'div',
      { className: 'mb-2 w-full flex-row justify-between items-center' },
      _react2.default.createElement(
        'span',
        null,
        'Ticket Price'
      ),
      _react2.default.createElement(
        'span',
        { className: '' },
        '\xA3',
        TICKET_PRICE.toFixed(2)
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'mb-2 w-full flex-row justify-between items-center' },
      _react2.default.createElement(
        'span',
        null,
        'Promo Discount'
      ),
      _react2.default.createElement(
        'span',
        null,
        '-\xA3',
        discount.toFixed(2)
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'mb-2 w-full flex-row justify-between items-center' },
      _react2.default.createElement(
        'span',
        null,
        'Donation'
      ),
      _react2.default.createElement(
        'span',
        null,
        '\xA3',
        donation.toFixed(2)
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'mb-4 w-full flex-row justify-between items-center font-bold' },
      _react2.default.createElement(
        'span',
        { className: '' },
        'Total'
      ),
      _react2.default.createElement(
        'span',
        { className: '' },
        '\xA3',
        (donation + TICKET_PRICE - discount).toFixed(2)
      )
    )
  );
};

var Details = function Details() {
  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      'h3',
      { className: 'font-bold text-lg' },
      'Launch Party Details'
    ),
    _react2.default.createElement('div', { className: 'h-px w-full bg-gray' }),
    _react2.default.createElement(
      'div',
      { className: 'w-full items-center' },
      _react2.default.createElement(
        'div',
        { className: 'my-4 space-y-4 bg-gray-light w-96 p-4' },
        _react2.default.createElement(
          'div',
          { className: 'flex-row' },
          _react2.default.createElement(_Icon2.default, { name: 'clock', size: 20, className: 'text-gray mr-6 mt-2' }),
          _react2.default.createElement(
            'div',
            { className: '' },
            _react2.default.createElement(
              'span',
              null,
              'Saturday, August 7, 2021'
            ),
            _react2.default.createElement(
              'span',
              null,
              '8pm to 12am (BST)'
            )
          )
        ),
        _react2.default.createElement(
          'span',
          { className: 'flex flex-row items-center' },
          _react2.default.createElement(_Icon2.default, { name: 'pin', size: 20, className: 'text-gray mr-6' }),
          '44 Great Cumberland Pl, London W1H 7BS'
        )
      )
    )
  );
};

var Email = exports.Email = function Email(_ref2) {
  var data = _ref2.data;

  return _react2.default.createElement(
    _layout2.default,
    { title: 'Launch Party' },
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
      'You joined our launch party!'
    ),
    _react2.default.createElement(Details, null),
    _react2.default.createElement(Summary, data),
    _react2.default.createElement('div', { className: 'h-px mb-4 w-full bg-gray' }),
    _react2.default.createElement(
      'span',
      null,
      'We are excited to meet you',
      data.donation && _react2.default.createElement(
        'span',
        { className: 'mb-2' },
        ' ',
        'and thank you for your kind donation of',
        ' ',
        _react2.default.createElement(
          'span',
          { className: 'font-bold' },
          '\xA3',
          data.donation
        )
      ),
      '!'
    )
  );
};