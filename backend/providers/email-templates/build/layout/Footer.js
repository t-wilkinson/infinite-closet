'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Footer = exports.Legal = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _components = require('../components');

var _api = require('../utils/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var iconImageStyle = {
  width: 50,
  height: 50,
  display: 'inline-block'
};

var socialMedia = [{
  href: 'https://twitter.com/_infinitecloset',
  src: '/icons/twitter-50.png'
}, {
  href: 'https://www.instagram.com/infinitecloset.uk',
  src: '/icons/instagram-50.png'
}, {
  href: 'https://www.facebook.com/InfiniteClosetUK',
  src: '/icons/facebook-50.png'
}];

var Legal = function Legal(_ref) {
  var _ref$color = _ref.color,
      color = _ref$color === undefined ? 'white' : _ref$color,
      props = _objectWithoutProperties(_ref, ['color']);

  return _react2.default.createElement(
    _Grid2.default,
    props,
    _react2.default.createElement(
      _Grid2.default.Row,
      { style: { textAlign: 'left' } },
      _react2.default.createElement(
        _Grid2.default.Cell,
        null,
        _react2.default.createElement(
          _components.Link,
          {
            href: 'https://infinitecloset.co.uk/en-US/privacy',
            style: { color: color }
          },
          'PRIVACY'
        ),
        ' ',
        '|',
        ' ',
        _react2.default.createElement(
          _components.Link,
          {
            href: 'https://infinitecloset.co.uk/en-US/terms-and-conditions',
            style: { color: color }
          },
          'TERMS'
        )
      ),
      _react2.default.createElement(
        _Grid2.default.Cell,
        { style: { textAlign: 'right' } },
        '\xA9 INFINITE CLOSET 2022'
      )
    )
  );
};

exports.Legal = Legal;
var Footer = exports.Footer = function Footer() {
  return _react2.default.createElement(
    _Grid2.default,
    {
      align: 'center',
      style: {
        width: '100%',
        fontSize: 14,
        textAlign: 'center'
      }
    },
    _react2.default.createElement(
      _Grid2.default.Cell,
      { style: { fontWeight: 'bold' } },
      'ENJOY FREE SHIPPING AND FREE RETURNS ON EVERY ORDER*',
      _react2.default.createElement('br', null),
      _react2.default.createElement('br', null)
    ),
    _react2.default.createElement(
      _Grid2.default,
      { bgcolor: '#39603d', style: { color: 'white' }, cellPadding: 8 },
      _react2.default.createElement(
        _Grid2.default,
        { cellPadding: 4 },
        _react2.default.createElement(
          _Grid2.default.Cell,
          null,
          '*Free shipping on all 2-day shipping orders. 1-day and next day orders standard shipping rates apply. Other restrictions may apply.',
          ' ',
          _react2.default.createElement(
            _components.Link,
            {
              href: 'https://infinitecloset.co.uk/en-US/terms-and-conditions',
              style: {
                color: 'white'
              }
            },
            'More Information.'
          )
        ),
        _react2.default.createElement(
          _components.Link,
          { href: 'https://infinitecloset.co.uk', style: { color: 'white' } },
          'www.infinitecloset.co.uk'
        ),
        _react2.default.createElement(
          _Grid2.default.Cell,
          null,
          'TAG US ON SOCIAL'
        ),
        _react2.default.createElement(
          _Grid2.default,
          { cellPadding: 16 },
          _react2.default.createElement(
            _Grid2.default,
            null,
            _react2.default.createElement(
              _Grid2.default.Row,
              null,
              socialMedia.map(function (_ref2) {
                var href = _ref2.href,
                    src = _ref2.src;
                return _react2.default.createElement(
                  _Grid2.default.Cell,
                  { key: src, style: iconImageStyle },
                  _react2.default.createElement(
                    _components.Link,
                    { href: href },
                    _react2.default.createElement(_components.Img, { src: (0, _api.getFrontendURL)(src) })
                  )
                );
              })
            )
          )
        )
      ),
      _react2.default.createElement(
        _Grid2.default.Cell,
        null,
        _react2.default.createElement(Legal, null)
      )
    )
  );
};

exports.default = Footer;