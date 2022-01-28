'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _ReviewRequest = require('../components/ReviewRequest');

var _ReviewRequest2 = _interopRequireDefault(_ReviewRequest);

var _MailingList = require('../components/MailingList');

var _MailingList2 = _interopRequireDefault(_MailingList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  return _react2.default.createElement(
    _layout.G,
    { align: 'center' },
    _react2.default.createElement(
      _layout.G,
      { align: 'center', cellPadding: 50 },
      _react2.default.createElement(_ReviewRequest2.default, null),
      _react2.default.createElement(_layout.Footer, null),
      _react2.default.createElement(_MailingList2.default, null)
    )
  );
};