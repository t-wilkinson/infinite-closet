'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;
  var user = data.order.user;


  return _react2.default.createElement(
    _layout2.default,
    { title: 'Trustpilot' },
    _react2.default.createElement('script', {
      type: 'application/json+trustpilot',
      dangerouslySetInnerHTML: {
        __html: '\n{\n"recipientName": "' + user.firstName + ' ' + user.lastName + '",\n"recipientEmail": "' + user.email + '",\n"referenceId": "' + data.order.id + '"\n}\n        '
      }
    })
  );
};