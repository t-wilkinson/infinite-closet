'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MailingList = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MailingList = exports.MailingList = function MailingList() {
  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      _layout.Container,
      { title: 'Get In The Know', href: '', button: 'Subscribe now' },
      _react2.default.createElement(
        'span',
        { style: { textAlign: 'center' } },
        'Haven\u2019t joined out mailing list? It\u2019s not too late! Be the first to know about new arrivals, exclusive offers, & perks!'
      )
    ),
    _react2.default.createElement('br', null)
  );
};

exports.default = MailingList;