'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = exports.Center = undefined;

var _Footer = require('./Footer');

Object.keys(_Footer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Footer[key];
    }
  });
});

var _Between = require('./Between');

Object.keys(_Between).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Between[key];
    }
  });
});

var _Grid = require('./Grid');

Object.keys(_Grid).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Grid[key];
    }
  });
});

var _Container = require('./Container');

Object.keys(_Container).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Container[key];
    }
  });
});

var _Paragraph = require('./Paragraph');

Object.keys(_Paragraph).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Paragraph[key];
    }
  });
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _components = require('../components');

var _Grid2 = _interopRequireDefault(_Grid);

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Center = exports.Center = function Center(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    _Grid2.default,
    { width: '100%', align: 'center' },
    _react2.default.createElement(
      _Grid2.default.Cell,
      { align: 'center' },
      children
    )
  );
};

var Layout = exports.Layout = function Layout(_ref2) {
  var title = _ref2.title,
      children = _ref2.children,
      _ref2$footer = _ref2.footer,
      footer = _ref2$footer === undefined ? true : _ref2$footer,
      img = _ref2.img,
      separator = _ref2.separator;
  return _react2.default.createElement(
    _Grid2.default,
    {
      bgcolor: '#e7ddcb',
      width: '100%'
    },
    _react2.default.createElement(
      _Grid2.default.Cell,
      { align: 'center' },
      _react2.default.createElement(
        _Grid2.default,
        { bgcolor: '#ffffff', width: '800', align: 'center' },
        _react2.default.createElement(
          _Grid2.default.Row,
          null,
          _react2.default.createElement(
            _Grid2.default,
            null,
            _react2.default.createElement(
              'center',
              null,
              img && _react2.default.createElement(_components.Img, {
                src: img,
                provider: 'frontend',
                width: '600',
                style: {
                  width: "600",
                  minWidth: "600"
                }
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_components.Img, {
                provider: 'frontend',
                src: '/media/brand/infinite-closet-text.png',
                width: '300',
                style: {
                  width: "300",
                  minWidth: "300"
                }
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(
                'span',
                {
                  style: { fontSize: 20, fontWeight: 700, textAlign: 'right' }
                },
                title.toUpperCase()
              )
            )
          )
        ),
        _react2.default.createElement(
          'center',
          null,
          _react2.default.createElement(
            _Grid2.default,
            { width: '600' },
            separator && _react2.default.createElement(_components.Separator, null),
            children
          ),
          _react2.default.createElement('br', null),
          footer && _react2.default.createElement(_Footer2.default, null)
        )
      )
    )
  );
};

exports.default = Layout;