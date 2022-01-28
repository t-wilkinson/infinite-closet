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

exports.default = function (_ref) {
  var data = _ref.data;
  var cartItem = data.cartItem,
      firstName = data.firstName,
      user = data.user;


  return _react2.default.createElement(
    _layout.Layout,
    { title: 'Order Ending' },
    _react2.default.createElement(_components.Space, null),
    _react2.default.createElement(
      _layout.P,
      null,
      _react2.default.createElement(
        'h3',
        null,
        'Hi ',
        firstName,
        ','
      ),
      _react2.default.createElement(
        'p',
        null,
        'We hope you\u2019ve enjoyed your rental! This is your reminder to please be sure to take your items and garment bag to your nearest Royal Mail by',
        ' ',
        _react2.default.createElement(
          'strong',
          null,
          (0, _utils.fmtDate)(cartItem.range.end)
        ),
        ' to avoid any late fees. Your return label can be found in your package.'
      )
    ),
    _react2.default.createElement(_components.Separator, null),
    _react2.default.createElement(_components.Order, cartItem),
    _react2.default.createElement(_components.Separator, { space: false }),
    _react2.default.createElement(_components.Space, { n: 2 }),
    _react2.default.createElement(_components.ReviewRequest, null),
    _react2.default.createElement(_components.Space, { n: 2 }),
    _react2.default.createElement(
      _layout.P,
      null,
      _react2.default.createElement(
        'p',
        null,
        'Any issues with your order or return? Please contact Customer Service at info@infinitecloset.co.uk or on Whatsapp +44 7521 933225.'
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
    _react2.default.createElement(_components.MailingList, null),
    _react2.default.createElement('script', {
      type: 'application/json+trustpilot',
      dangerouslySetInnerHTML: {
        __html: '\n{\n"recipientName": "' + user.firstName + ' ' + user.lastName + '",\n"recipientEmail": "' + user.email + '",\n"referenceId": "' + cartItem.order.id + '"\n}\n        '
      }
    })
  );
};