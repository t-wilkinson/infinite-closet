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
  var status = data.status,
      firstName = data.firstName,
      user = data.user;

  return _react2.default.createElement(
    _layout.Layout,
    { title: 'Wardrobe Item Creation' },
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
      status === 'success' ? _react2.default.createElement(
        'p',
        null,
        'Your new wardrobe item is successfully created and as been added to your wardrobe!'
      ) : _react2.default.createElement(
        'p',
        null,
        'We ran into an order uploading one of your wardrobe items. If this problem persists please contact our team at info@infinitecloset.co.uk.'
      )
    ),
    _react2.default.createElement(_components.Separator, null)
  );
};