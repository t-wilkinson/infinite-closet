"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var data = _ref.data;
  var user = data.user,
      cartItem = data.cartItem;


  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement("script", {
      type: "application/json+trustpilot",
      dangerouslySetInnerHTML: {
        __html: "\n{\n\"recipientName\": \"" + user.firstName + " " + user.lastName + "\",\n\"recipientEmail\": \"" + user.email + "\",\n\"referenceId\": \"" + cartItem.order.id + "\"\n}\n        "
      }
    }),
    "{\n\"recipientName\": \"" + user.firstName + " " + user.lastName + "\",\n\"recipientEmail\": \"" + user.email + "\",\n\"referenceId\": \"" + cartItem.order.id + "\"\n}"
  );
};