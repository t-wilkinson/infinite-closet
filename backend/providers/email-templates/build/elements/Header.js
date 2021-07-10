'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Grid = require('../layout/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = {
  header: {
    margin: '10px auto 20px auto',
    width: 'auto'
  },

  img: {
    height: '35px'
  }
};

function Header() {
  return _react2.default.createElement(
    _Grid2.default,
    { style: style.header },
    _react2.default.createElement(
      'h1',
      { className: 'font-header text-xl' },
      'INFINITE CLOSET'
    )
  );
}

exports.default = Header;