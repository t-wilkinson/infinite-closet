'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = undefined;

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

// export const Center = ({children}) =>
//   <G width="100%" align="center">
//     <G.Cell align="center">
//         {children}
//     </G.Cell>
//   </G>

var Layout = exports.Layout = function Layout(_ref) {
  var title = _ref.title,
      children = _ref.children,
      _ref$footer = _ref.footer,
      footer = _ref$footer === undefined ? true : _ref$footer,
      img = _ref.img,
      separator = _ref.separator;
  return _react2.default.createElement(
    _Grid2.default,
    {
      bgcolor: '#e7ddcb',
      width: '100%',
      align: 'center',
      style: {
        width: '100%'
      }
    },
    _react2.default.createElement(
      _Grid2.default.Cell,
      { align: 'center' },
      _react2.default.createElement(
        _Grid2.default,
        {
          bgcolor: '#ffffff',
          width: '100%',
          align: 'center',
          style: { width: '100%', maxWidth: 1000 }
        },
        _react2.default.createElement(
          _Grid2.default.Row,
          null,
          _react2.default.createElement(
            _Grid2.default,
            null,
            _react2.default.createElement(
              _Grid2.default.Cell,
              { align: 'center' },
              img && _react2.default.createElement(_components.Img, {
                src: img,
                provider: 'frontend',
                width: '600',
                style: {
                  width: '600',
                  minWidth: '600'
                }
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_components.Img, {
                provider: 'frontend',
                src: '/media/brand/infinite-closet-text.png',
                width: '300',
                style: {
                  width: '300',
                  minWidth: '300'
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
          _Grid2.default.Cell,
          { align: 'center' },
          separator && _react2.default.createElement(_components.Separator, null),
          _react2.default.createElement(
            _Grid2.default,
            { style: { width: 700 }, width: '700', align: 'center' },
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