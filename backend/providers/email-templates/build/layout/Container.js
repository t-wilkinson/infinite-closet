'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Container = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _components = require('../components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Container = exports.Container = function Container(_ref) {
  var title = _ref.title,
      href = _ref.href,
      button = _ref.button,
      children = _ref.children;

  return _react2.default.createElement(
    _Grid2.default,
    {
      align: 'center',
      cellPadding: 16,
      style: {
        border: '1px solid #5f6368',
        width: 700
      },
      width: '700'
    },
    _react2.default.createElement(
      _Grid2.default,
      { style: { textAlign: 'center' }, cellPadding: 4, align: 'center' },
      _react2.default.createElement(
        _Grid2.default.Cell,
        { align: 'center' },
        title && _react2.default.createElement(
          'strong',
          {
            style: {
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '1.2em'
            }
          },
          title
        )
      ),
      _react2.default.createElement(
        _Grid2.default.Cell,
        { align: 'center' },
        children
      ),
      _react2.default.createElement(
        _Grid2.default.Cell,
        { align: 'center' },
        button && _react2.default.createElement('br', null)
      ),
      _react2.default.createElement(
        _Grid2.default.Cell,
        { align: 'center' },
        button && _react2.default.createElement(
          _components.ButtonLink,
          { href: href },
          button
        )
      )
    )
  );
};

exports.default = Container;