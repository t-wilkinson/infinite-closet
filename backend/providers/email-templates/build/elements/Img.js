"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imgStyle = {
  img: {
    objectFit: "contain",
    outline: "none",
    textDecoration: "none",
    border: "none",
    display: "block"
  }
};

function Img(_ref) {
  var src = _ref.src,
      alt = _ref.alt,
      className = _ref.className,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style;

  return _react2.default.createElement("img", {
    src: src,
    alt: alt,
    style: Object.assign({}, imgStyle.img, style),
    className: className
  });
}

exports.default = Img;