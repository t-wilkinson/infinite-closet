'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReviewRequest = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReviewRequest = exports.ReviewRequest = function ReviewRequest() {
  return _react2.default.createElement(
    _layout.Container,
    {
      title: 'Don\'t forget to leave a review',
      href: '/user/order-history',
      button: 'Review Your Items'
    },
    _react2.default.createElement(
      'span',
      { style: { textAlign: 'center' } },
      'Your feedback helps us learn how we can improve! Write a product review for one or more of your rental items and recieve a \xA35 promo code for your next order.'
    )
  );
};

exports.default = ReviewRequest;