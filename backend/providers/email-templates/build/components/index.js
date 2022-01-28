'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Heading = exports.Space = exports.Separator = exports.Img = exports.Link = exports.ButtonLink = undefined;

var _Order = require('./Order');

Object.keys(_Order).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Order[key];
    }
  });
});

var _ReviewRequest = require('./ReviewRequest');

Object.keys(_ReviewRequest).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ReviewRequest[key];
    }
  });
});

var _MailingList = require('./MailingList');

Object.keys(_MailingList).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _MailingList[key];
    }
  });
});

var _Shop = require('./Shop');

Object.keys(_Shop).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Shop[key];
    }
  });
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _api = require('../utils/api');

var api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var withProvider = function withProvider(url, provider) {
  return url = provider === 'frontend' ? api.getFrontendURL(url) : provider === 'backend' ? api.getBackendURL(url) : // ? api.getFrontendURL(`/_next/image?url=${encodeURIComponent(api.getBackendURL(url))}&w=${1024}&q=75`)
  url;
};

var ButtonLink = exports.ButtonLink = function ButtonLink(_ref) {
  var href = _ref.href,
      _ref$provider = _ref.provider,
      provider = _ref$provider === undefined ? 'frontend' : _ref$provider,
      children = _ref.children,
      style = _ref.style;

  return _react2.default.createElement(
    'table',
    { align: 'center', cellPadding: 8 },
    _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        'tr',
        null,
        _react2.default.createElement(
          'td',
          { bgcolor: '#39603d', cellPadding: 4 },
          _react2.default.createElement(
            'a',
            {
              href: withProvider(href, provider),
              style: Object.assign({
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textDecoration: 'none'
              }, style)
            },
            children
          )
        )
      )
    )
  );
};

var Link = function Link(_ref2) {
  var href = _ref2.href,
      _ref2$provider = _ref2.provider,
      provider = _ref2$provider === undefined ? 'frontend' : _ref2$provider,
      children = _ref2.children,
      style = _ref2.style,
      props = _objectWithoutProperties(_ref2, ['href', 'provider', 'children', 'style']);

  return _react2.default.createElement(
    'a',
    Object.assign({ href: withProvider(href, provider),
      style: Object.assign({
        textDecoration: 'underline'
      }, style)
    }, props),
    children
  );
};

exports.Link = Link;
var imgStyle = {
  img: {
    objectFit: 'contain',
    outline: 'none',
    textDecoration: 'none',
    border: 'none'
  }
};

var Img = function Img(_ref3) {
  var src = _ref3.src,
      alt = _ref3.alt,
      _ref3$className = _ref3.className,
      className = _ref3$className === undefined ? '' : _ref3$className,
      _ref3$style = _ref3.style,
      style = _ref3$style === undefined ? {} : _ref3$style,
      provider = _ref3.provider,
      props = _objectWithoutProperties(_ref3, ['src', 'alt', 'className', 'style', 'provider']);

  return _react2.default.createElement('img', Object.assign({
    src: withProvider(src, provider),
    alt: alt,
    style: Object.assign({}, imgStyle.img, style),
    className: className
  }, props));
};

exports.Img = Img;
var Separator = exports.Separator = function Separator(_ref4) {
  var _ref4$space = _ref4.space,
      space = _ref4$space === undefined ? true : _ref4$space;

  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    space && _react2.default.createElement('br', null),
    _react2.default.createElement(
      'table',
      { width: '100%', style: { width: '100%' } },
      _react2.default.createElement(
        'tbody',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement('td', {
            style: {
              background: 'none',
              border: 'solid 1px #cccccc',
              borderWidth: '1px 0 0 0',
              height: '1px',
              width: '100%',
              margin: '0px 0px 0px 0px'
            }
          })
        )
      )
    ),
    _react2.default.createElement('br', null)
  );
};

var Space = exports.Space = function Space(_ref5) {
  var _ref5$n = _ref5.n,
      n = _ref5$n === undefined ? 1 : _ref5$n;
  return Array(n).fill(null).map(function (_, i) {
    return _react2.default.createElement('br', { key: i });
  });
};

var Heading = exports.Heading = function Heading(_ref6) {
  var children = _ref6.children;
  return _react2.default.createElement(
    'center',
    null,
    _react2.default.createElement(
      'strong',
      {
        style: {
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '1.2em'
        }
      },
      children
    )
  );
};