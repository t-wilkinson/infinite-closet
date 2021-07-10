'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Grid = require('../layout/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Layout = exports.Layout = function Layout(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    'div',
    { className: 'bg-gray-light py-4' },
    _react2.default.createElement(
      _Grid2.default,
      { className: 'max-w-screen-sm' },
      _react2.default.createElement(_Header2.default, null),
      _react2.default.createElement(
        _Grid2.default,
        null,
        _react2.default.createElement(
          _Grid2.default.Cell,
          { className: 'bg-white p-4' },
          _react2.default.createElement(
            'h1',
            { className: 'w-full items-center text-xl font-header mt-2 mb-4' },
            'INFINITE CLOSET'
          ),
          children
        )
      ),
      _react2.default.createElement(_Footer2.default, null)
    )
  );
};
exports.default = Layout;