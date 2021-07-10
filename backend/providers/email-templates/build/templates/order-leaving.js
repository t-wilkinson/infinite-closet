"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _layout = require("../layout");

var _layout2 = _interopRequireDefault(_layout);

var _Order = require("../elements/Order");

var _Order2 = _interopRequireDefault(_Order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;

  return _react2.default.createElement(
    _layout2.default,
    { title: "Order Ending" },
    _react2.default.createElement(
      "h3",
      { style: { margin: 0 } },
      "Hello ",
      data.name,
      ","
    ),
    _react2.default.createElement(
      "span",
      null,
      "Hope you enjoyed your order!"
    ),
    _react2.default.createElement(
      "span",
      null,
      "Please expect a service to pick it up around midday today."
    ),
    _react2.default.createElement(_Order2.default, data),
    _react2.default.createElement(
      "span",
      null,
      "We hope to see you again soon."
    )
  );
};