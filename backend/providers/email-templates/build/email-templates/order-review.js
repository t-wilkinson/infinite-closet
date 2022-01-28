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


  return _react2.default.createElement(
    _layout.Layout,
    { title: 'Tell Us Whats Up' },
    _react2.default.createElement(_components.Space, { n: 1 }),
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
        'How was your rental experience? Please let us know how you liked your pieces -- We and other customers would love to know!'
      )
    ),
    _react2.default.createElement(_components.Separator, null),
    _react2.default.createElement(_components.Order, Object.assign({}, cartItem, { review: true })),
    _react2.default.createElement(_components.Separator, { space: false }),
    _react2.default.createElement(_components.Space, { n: 2 }),
    _react2.default.createElement(
      _layout.Container,
      {
        title: '\xA35 For Your Thoughts',
        href: '',
        button: 'Review Your Items'
      },
      _react2.default.createElement(
        'span',
        { style: { textAlign: 'center' } },
        'Your feedback helps us learn how we can improve! Write a product review for one or more of your rental items and recieve a \xA35 promo code for your next order.'
      )
    ),
    _react2.default.createElement(_components.Space, { n: 2 }),
    _react2.default.createElement(
      _layout.P,
      null,
      _react2.default.createElement(
        'p',
        null,
        'We hope to see you again soon!'
      ),
      _react2.default.createElement(
        'p',
        null,
        'The Infinite Closet Team',
        _react2.default.createElement('br', null),
        'info@infinitecloset.co.uk'
      )
    ),
    _react2.default.createElement(_components.Space, { n: 2 }),
    _react2.default.createElement(_components.MailingList, null),
    _react2.default.createElement(_components.Space, { n: 1 })
  );
};