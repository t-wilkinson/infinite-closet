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
  var recommendations = data.recommendations,
      giftCard = data.giftCard,
      firstName = data.firstName;

  return _react2.default.createElement(
    _layout.Layout,
    {
      title: 'You\'ve Received a Gift Card',
      src: '/photoshoot/ping-dress-mirror.png'
    },
    _react2.default.createElement(_components.Space, { n: 1 }),
    _react2.default.createElement(_components.Separator, null),
    _react2.default.createElement(
      _layout.P,
      null,
      _react2.default.createElement(
        'p',
        null,
        'Hello ',
        firstName,
        ','
      ),
      _react2.default.createElement(
        'p',
        null,
        'You\u2019ve recieved a gift card! Your ',
        (0, _utils.fmtPrice)(giftCard.value),
        ' gift card code is',
        ' ',
        _react2.default.createElement(
          'strong',
          null,
          giftCard.code
        ),
        '. Use the code in the discount section during your next checkout.'
      )
    ),
    _react2.default.createElement(_components.Space, { n: 3 }),
    _react2.default.createElement(
      _components.Heading,
      null,
      'Ready to shop?'
    ),
    _react2.default.createElement(_components.Separator, null),
    _react2.default.createElement(_components.YouMayAlsoLike, { recommendations: recommendations }),
    _react2.default.createElement(_components.MailingList, null)
  );
};