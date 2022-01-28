'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YouMayAlsoLike = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../layout');

var _components = require('../components');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ShopItem = function ShopItem(product) {
  return _react2.default.createElement(
    _layout.G,
    { style: { fontSize: 14 } },
    _react2.default.createElement(
      _components.Link,
      {
        provider: 'frontend',
        href: '/shop/' + product.designer.slug + '/' + product.slug
      },
      _react2.default.createElement(_components.Img, {
        provider: 'backend',
        src: product.images[0].url,
        width: '100', height: '200',
        style: { width: 100, height: 200 }
      })
    ),
    _react2.default.createElement('br', null),
    _react2.default.createElement(
      _layout.G.Cell,
      { style: { lineHeight: 1.1 } },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'strong',
          { style: { textTransform: 'uppercase' } },
          product.designer.name
        )
      ),
      _react2.default.createElement(
        'div',
        null,
        product.name
      ),
      _react2.default.createElement(
        'div',
        null,
        product.sizes.map(function (size, i) {
          return _react2.default.createElement(
            'span',
            { key: i },
            i > 0 ? ', ' : '',
            (0, _utils.normalizeSize)(size)
          );
        })
      ),
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'strong',
          null,
          (0, _utils.fmtPrice)(product.shortRentalPrice, true),
          '-',
          (0, _utils.fmtPrice)(product.longRentalPrice, true)
        ),
        ' | ',
        _react2.default.createElement(
          'span',
          { style: { color: '#5f6368' } },
          (0, _utils.fmtPrice)(product.retailPrice, true),
          ' retail'
        )
      )
    )
  );
};

var YouMayAlsoLike = exports.YouMayAlsoLike = function YouMayAlsoLike(_ref) {
  var recommendations = _ref.recommendations;

  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      _layout.G,
      null,
      _react2.default.createElement(
        _layout.G.Row,
        null,
        recommendations.map(function (product, i) {
          return _react2.default.createElement(ShopItem, Object.assign({ key: i }, product));
        })
      ),
      _react2.default.createElement(
        _layout.G.Cell,
        { colSpan: recommendations.length },
        _react2.default.createElement(
          _layout.G,
          { cellPadding: 32 },
          _react2.default.createElement(
            'center',
            null,
            _react2.default.createElement(
              _components.ButtonLink,
              { href: '/products/clothing' },
              'Find Your Look'
            )
          )
        )
      )
    ),
    _react2.default.createElement('br', null),
    _react2.default.createElement('br', null)
  );
};