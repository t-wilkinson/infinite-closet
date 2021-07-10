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
    "dl",
    null,
    _react2.default.createElement(
      "dt",
      null,
      "Order"
    ),
    _react2.default.createElement(
      "dd",
      null,
      _react2.default.createElement(
        "code",
        null,
        JSON.stringify(data.order, null, 4)
      )
    ),
    _react2.default.createElement(
      "dt",
      null,
      "Error"
    ),
    _react2.default.createElement(
      "dd",
      null,
      _react2.default.createElement(
        "code",
        null,
        JSON.stringify(data.error, null, 4)
      )
    )
  );
};