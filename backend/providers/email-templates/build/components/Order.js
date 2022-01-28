'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderSummary = exports.Order = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dayjs = require('dayjs');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _utc = require('dayjs/plugin/utc');

var _utc2 = _interopRequireDefault(_utc);

var _timezone = require('dayjs/plugin/timezone');

var _timezone2 = _interopRequireDefault(_timezone);

var _utils = require('../utils');

var _layout = require('../layout');

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dayjs2.default.extend(_utc2.default);
_dayjs2.default.extend(_timezone2.default);

var styles = {
  cell: {
    verticalAlign: 'top'
  },
  img: {
    width: 80,
    height: 150
  }
};

var Order = exports.Order = function Order(_ref) {
  var totalPrice = _ref.totalPrice,
      order = _ref.order,
      range = _ref.range,
      _ref$review = _ref.review,
      review = _ref$review === undefined ? false : _ref$review;

  return _react2.default.createElement(
    _layout.G,
    { style: { tableLayout: 'fixed' }, cellPadding: 4 },
    _react2.default.createElement(
      _layout.G.Row,
      null,
      _react2.default.createElement(
        _layout.G.Cell,
        { style: Object.assign({}, styles.cell, styles.img) },
        _react2.default.createElement(
          'a',
          {
            style: {},
            provider: 'frontend',
            href: '/shop/' + order.product.slug + '/' + order.product.designer.slug
          },
          _react2.default.createElement(_.Img, {
            provider: 'backend',
            width: '60', height: '110',
            style: { width: 60, height: 110 },
            src: order.product.images[0].url,
            alt: order.product.images[0].alternativeText
          })
        )
      ),
      _react2.default.createElement(
        _layout.G.Cell,
        { style: Object.assign({}, styles.cell, { textAlign: 'left' }) },
        _react2.default.createElement(
          _layout.G,
          null,
          _react2.default.createElement(
            'span',
            null,
            order.product.name,
            ' by',
            ' ',
            _react2.default.createElement(
              'span',
              { style: { fontWeight: 700 } },
              order.product.designer.name
            )
          ),
          _react2.default.createElement(
            'span',
            null,
            (0, _utils.fmtDate)(range.start),
            ' - ',
            (0, _utils.fmtDate)(range.end)
          ),
          _react2.default.createElement(
            'span',
            null,
            'Size: ',
            order.size
          )
        )
      ),
      review ? _react2.default.createElement(
        _layout.G.Cell,
        { style: { width: '14em', textAlign: 'right' } },
        _react2.default.createElement(
          _.ButtonLink,
          {
            href: '/shop/' + order.product.designer.slug + '/' + order.product.slug + '#reviews',
            provider: 'frontend'
          },
          'Review this item'
        )
      ) : _react2.default.createElement(
        _layout.G.Cell,
        { style: Object.assign({}, styles.cell, { width: '8em', textAlign: 'right' }) },
        _react2.default.createElement(
          'strong',
          null,
          (0, _utils.fmtPrice)(totalPrice)
        )
      )
    )
  );
};

var OrderSummary = exports.OrderSummary = function OrderSummary() {};

exports.default = Order;