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
  var firstName = data.firstName,
      cartItem = data.cartItem;
  var trackingId = cartItem.order.trackingId;


  return _react2.default.createElement(
    _layout.Layout,
    { title: 'Your Order Has Shipped' },
    _react2.default.createElement(
      _layout.P,
      null,
      _react2.default.createElement(
        'p',
        null,
        'Hi ',
        firstName,
        ','
      ),
      _react2.default.createElement(
        'p',
        null,
        'Your order has shipped! Get ready for your rental! You can find more details about your order in your',
        ' ',
        _react2.default.createElement(
          _components.Link,
          { href: '/user/order-history' },
          'account'
        ),
        '.'
      ),
      _react2.default.createElement('br', null),
      trackingId && _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
          _components.ButtonLink,
          {
            href: 'https://www.royalmail.com/track-your-item#/tracking-results/' + trackingId,
            target: '_blank'
          },
          'TRACK YOUR ORDER'
        ),
        _react2.default.createElement('br', null)
      ),
      _react2.default.createElement(
        'p',
        null,
        'Any issues with your order? Please contact Customer Service at info@infinitecloset.co.uk or on Whatsapp +44 7521 933225. They will arrange an exchange or provide you with rental credit to use on a future order. If you have multiple orders, you don\u2019t need to return the unworn item earlier - just please return everything together at the end of your rental period.'
      ),
      _react2.default.createElement(
        'p',
        null,
        'Thanks for shopping with us!'
      ),
      _react2.default.createElement(
        'p',
        null,
        'Best,'
      ),
      _react2.default.createElement(
        'strong',
        null,
        'Team Infinite Closet'
      )
    ),
    _react2.default.createElement(_components.Separator, null),
    _react2.default.createElement(_components.Order, cartItem),
    _react2.default.createElement(_components.Separator, { space: false }),
    _react2.default.createElement(_components.Space, null),
    _react2.default.createElement(_components.MailingList, null)
  );
};