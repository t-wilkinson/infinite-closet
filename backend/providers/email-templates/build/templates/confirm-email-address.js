"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;

  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(
      "p",
      null,
      "Thank you for registering!"
    ),
    _react2.default.createElement(
      "p",
      null,
      "You have to confirm your email address. Please click on the link below."
    ),
    _react2.default.createElement(
      "p",
      null,
      data.url
    ),
    _react2.default.createElement(
      "p",
      null,
      "Thanks."
    )
  );
};