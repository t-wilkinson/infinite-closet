'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _Icon = require('../components/Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Summary = function Summary(_ref) {
  var guests = _ref.guests,
      ticketPrice = _ref.ticketPrice,
      discount = _ref.discount,
      donation = _ref.donation,
      total = _ref.total;

  return _react2.default.createElement(
    _layout.Grid,
    null,
    _react2.default.createElement(
      'h3',
      { style: { margin: 0, marginTop: 16 } },
      'Order Summary'
    ),
    _react2.default.createElement('div', {
      style: {
        height: 2,
        marginBottom: 16,
        backgroundColor: '#5f6368'
      }
    }),
    _react2.default.createElement(_layout.Between, { left: 'Ticket Price', right: (0, _utils.fmtPrice)(ticketPrice) }),
    _react2.default.createElement(_layout.Between, {
      left: 'Guest Tickets',
      right: (0, _utils.fmtPrice)(guests.length * ticketPrice)
    }),
    _react2.default.createElement(_layout.Between, { left: 'Promo Discount', right: (0, _utils.fmtPrice)(discount) }),
    _react2.default.createElement(_layout.Between, { left: 'Donation', right: (0, _utils.fmtPrice)(donation) }),
    _react2.default.createElement(_layout.Between, {
      style: { fontWeight: 700 },
      left: 'Total',
      right: (0, _utils.fmtPrice)(total)
    })
  );
};

var Details = function Details() {
  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      'h3',
      { style: { margin: 0, marginTop: 16 } },
      'Launch Party Details'
    ),
    _react2.default.createElement('div', {
      style: {
        height: 2,
        marginBottom: 16,
        backgroundColor: '#5f6368'
      }
    }),
    _react2.default.createElement(
      'div',
      { style: { backgroundColor: '#efefef', padding: 16 } },
      _react2.default.createElement(
        _layout.Grid,
        null,
        _react2.default.createElement(
          _layout.Grid.Row,
          null,
          _react2.default.createElement(_Icon2.default, { name: 'clock', size: 20, style: { color: '#5f6368' }, className: 'mr-6 mt-2' }),
          _react2.default.createElement(
            'div',
            { className: '' },
            _react2.default.createElement(
              'span',
              null,
              'Saturday, September 18, 2021'
            ),
            _react2.default.createElement(
              'span',
              null,
              '8pm to 12am (BST)'
            )
          )
        ),
        _react2.default.createElement('div', { style: { height: 16 } }),
        _react2.default.createElement(
          _layout.Grid.Row,
          null,
          _react2.default.createElement(_Icon2.default, { name: 'pin', size: 20, style: { color: '#5f6368' }, className: 'mr-6' }),
          '44 Great Cumberland Pl, London W1H 7BS'
        )
      )
    )
  );
};

exports.default = function (_ref2) {
  var data = _ref2.data;

  return _react2.default.createElement(
    _layout.Layout,
    { title: 'Launch Party' },
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
      'You joined our launch party!'
    ),
    _react2.default.createElement(Details, null),
    _react2.default.createElement(Summary, data),
    _react2.default.createElement('div', {
      style: {
        height: 2,
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: '#5f6368'
      }
    }),
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
          { style: { fontWeight: 'bold' } },
          '\xA3',
          data.donation
        )
      ),
      '!'
    )
  );
};