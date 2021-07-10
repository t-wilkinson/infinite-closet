"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Grid = require("../layout/Grid");

var _Grid2 = _interopRequireDefault(_Grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (_ref) {
  var _ref$style = _ref.style,
      style = _ref$style === undefined ? { left: {}, right: {} } : _ref$style,
      left = _ref.left,
      right = _ref.right;

  var leftStyle = style.left,
      rightStyle = style.right,
      mainStyle = _objectWithoutProperties(style, ["left", "right"]);

  return _react2.default.createElement(
    _Grid2.default,
    { style: Object.assign({}, mainStyle, { marginBottom: 4, width: "100%" }) },
    _react2.default.createElement(
      _Grid2.default.Row,
      null,
      _react2.default.createElement(
        _Grid2.default.Cell,
        { style: Object.assign({}, leftStyle, { textAlign: "left" }) },
        left
      ),
      _react2.default.createElement(
        _Grid2.default.Cell,
        { style: Object.assign({}, rightStyle, { textAlign: "right" }) },
        right
      )
    )
  );
};