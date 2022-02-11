'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _components = require('../components');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Summary = function Summary(_ref) {
  var left = _ref.left,
      right = _ref.right,
      props = _objectWithoutProperties(_ref, ['left', 'right']);

  return right ? _react2.default.createElement(
    _layout.G.Row,
    props,
    _react2.default.createElement(
      _layout.G.Cell,
      { style: { textAlign: 'right' } },
      left,
      ':'
    ),
    _react2.default.createElement(
      _layout.G.Cell,
      { style: { textAlign: 'left' } },
      '\xA0\xA0\xA0',
      isNaN(right) ? right : (0, _utils.fmtPrice)(right)
    )
  ) : null;
};

exports.default = function (_ref2) {
  var data = _ref2.data;
  var contact = data.contact,
      cart = data.cart,
      address = data.address,
      summary = data.summary,
      recommendations = data.recommendations;


  return _react2.default.createElement(
    _layout.Layout,
    { title: 'Order Confirmation' },
    _react2.default.createElement(_components.Space, { n: 2 }),
    _react2.default.createElement(
      _layout.P,
      null,
      _react2.default.createElement(
        'p',
        null,
        'Hi ',
        contact.firstName,
        ','
      ),
      _react2.default.createElement(
        'p',
        null,
        'Thank you for your order! Your order has been processed and you will receive an email when it ships.'
      )
    ),
    _react2.default.createElement(_components.Space, { n: 1 }),
    _react2.default.createElement(
      _components.Heading,
      null,
      'Your Items'
    ),
    _react2.default.createElement(_components.Separator, { space: false }),
    cart.map(function (item, i) {
      return _react2.default.createElement(
        _react2.default.Fragment,
        { key: i },
        i > 0 && _react2.default.createElement(_components.Separator, { space: false }),
        _react2.default.createElement(_components.Order, item)
      );
    }),
    _react2.default.createElement(_components.Separator, { space: false }),
    _react2.default.createElement(
      _layout.G,
      null,
      _react2.default.createElement(
        _layout.G.Row,
        null,
        _react2.default.createElement(
          _layout.G.Cell,
          { width: '100%', style: { width: '100%' } },
          _react2.default.createElement(
            _layout.G,
            null,
            _react2.default.createElement(
              'span',
              { style: { color: '#5f6368' } },
              'Shipping To'
            ),
            address.fullName,
            address.mobileNumber,
            address.addressLine1
          )
        ),
        _react2.default.createElement(
          _layout.G.Cell,
          null,
          _react2.default.createElement(
            'table',
            null,
            _react2.default.createElement(
              'tbody',
              null,
              _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                  'td',
                  { colSpan: 2 },
                  _react2.default.createElement(
                    'span',
                    { style: { color: '#5f6368' } },
                    'Price Summary'
                  )
                )
              ),
              _react2.default.createElement(Summary, { left: 'Subtotal', right: summary.subtotal }),
              _react2.default.createElement(Summary, {
                left: 'Promo Code',
                right: summary.coupon && summary.coupon.code
              }),
              _react2.default.createElement(Summary, { left: 'Shipping', right: summary.shipping || 'Free' }),
              _react2.default.createElement(Summary, { left: 'Insurance', right: summary.insurance }),
              _react2.default.createElement(Summary, {
                left: 'TOTAL',
                right: summary.total,
                style: {
                  fontWeight: 'bold'
                }
              })
            )
          )
        )
      )
    ),
    _react2.default.createElement(_components.Space, { n: 2 }),
    _react2.default.createElement(
      _layout.P,
      null,
      _react2.default.createElement(
        'p',
        null,
        'Need to make changes to your order? You can do so by contacting Customer Service at info@infinitecloset.co.uk or on Whatsapp +44 7521 933225.'
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
    _react2.default.createElement(_components.Space, { n: 2 }),
    _react2.default.createElement(
      _components.Heading,
      null,
      'You may also like'
    ),
    _react2.default.createElement(_components.Separator, null),
    _react2.default.createElement(_components.YouMayAlsoLike, { recommendations: recommendations }),
    _react2.default.createElement(_components.MailingList, null)
  );
};