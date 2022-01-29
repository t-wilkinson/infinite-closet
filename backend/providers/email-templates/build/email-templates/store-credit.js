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
      firstName = data.firstName,
      amount = data.amount;

  return _react2.default.createElement(
    _layout.Layout,
    {
      title: 'You Have Store Credit',
      img: '/media/photoshoot/pink-dress-mirror.png'
    },
    _react2.default.createElement(_components.Separator, null),
    _react2.default.createElement(
      _layout.G,
      { cellPadding: 8 },
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
          'You\u2019ve recieved store credit! Your ',
          (0, _utils.fmtPrice)(amount),
          ' credit has been applied to your account and will be automatically applied to your next rental.'
        )
      )
    ),
    _react2.default.createElement(_components.Space, { n: 2 }),
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