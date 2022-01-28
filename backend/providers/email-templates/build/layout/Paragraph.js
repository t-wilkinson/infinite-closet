'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.P = exports.Paragraph = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Grid = require('./Grid');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Paragraph = function Paragraph(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ['children']);

  return _react2.default.createElement(
    _Grid.G,
    Object.assign({ cellPadding: 4 }, props),
    children
  );
};

exports.Paragraph = Paragraph;
var P = exports.P = Paragraph;

exports.default = Paragraph;