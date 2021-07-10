"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Grid = require("../layout/Grid");

var _Grid2 = _interopRequireDefault(_Grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Footer() {
  return _react2.default.createElement(
    _Grid2.default,
    {
      style: {
        marginTop: 16,
        fontSize: 14,
        color: "#5f6368",
        textAlign: "center"
      }
    },
    _react2.default.createElement(
      "a",
      { style: { color: "#3b82f6" }, href: "https://infinitecloset.co.uk" },
      "https://InfiniteCloset.co.uk"
    )
  );
}

exports.default = Footer;