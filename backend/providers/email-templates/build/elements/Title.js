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

  wrapper: {
    width: 'auto',
    margin: '0 auto'
  },

  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '5px',
    marginBottom: '10px'
  }

};

function Title(_ref) {
  var children = _ref.children;

  return _react2.default.createElement(
    _Grid2.default,
    { style: style.wrapper },
    _react2.default.createElement(
      'h1',
      { style: style.title, className: 'title-heading' },
      children
    )
  );
}

exports.default = Title;