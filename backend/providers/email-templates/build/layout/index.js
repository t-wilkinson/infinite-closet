"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Img = require("../elements/Img");

var _Img2 = _interopRequireDefault(_Img);

var _Grid = require("./Grid");

var _Grid2 = _interopRequireDefault(_Grid);

var _Footer = require("../elements/Footer");

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Layout = exports.Layout = function Layout(_ref) {
  var title = _ref.title,
      children = _ref.children;
  return _react2.default.createElement(
    "div",
    {
      style: {
        width: "100%",
        background: "#efefef",
        paddingTop: 16,
        paddingBottom: 16
      }
    },
    _react2.default.createElement(
      _Grid2.default,
      { style: { width: "100%", maxWidth: 700, margin: "0 auto" } },
      _react2.default.createElement(
        _Grid2.default.Row,
        null,
        _react2.default.createElement(
          _Grid2.default,
          null,
          _react2.default.createElement(
            _Grid2.default.Row,
            null,
            _react2.default.createElement(_Img2.default, {
              style: {
                height: 128,
                width: 256,
                objectFit: "cover"
              },
              src: "https://infinitecloset.co.uk/media/brand/logo-lockup-gray-transparent.png"
            }),
            _react2.default.createElement(
              _Grid2.default.Cell,
              {
                style: { fontSize: 20, fontWeight: 700, textAlign: "right" }
              },
              title
            )
          )
        )
      ),
      _react2.default.createElement(
        _Grid2.default.Row,
        { style: { width: "100%", background: "white" } },
        _react2.default.createElement(
          "div",
          { style: { margin: 16 } },
          _react2.default.createElement(
            _Grid2.default,
            { style: { width: "100%" } },
            children
          )
        )
      ),
      _react2.default.createElement(_Footer2.default, null)
    )
  );
};
exports.default = Layout;