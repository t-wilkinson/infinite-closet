'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Grid = require('../layout/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Img = require('../elements/Img');

var _Img2 = _interopRequireDefault(_Img);

var _Between = require('../elements/Between');

var _Between2 = _interopRequireDefault(_Between);

var _dayjs = require('dayjs');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _utc = require('dayjs/plugin/utc');

var _utc2 = _interopRequireDefault(_utc);

var _timezone = require('dayjs/plugin/timezone');

var _timezone2 = _interopRequireDefault(_timezone);

var _api = require('../api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dayjs2.default.extend(_utc2.default);
_dayjs2.default.extend(_timezone2.default);

var Order = function Order(_ref) {
  var totalPrice = _ref.totalPrice,
      order = _ref.order,
      range = _ref.range;

  var formatDate = function formatDate(date) {
    return (0, _dayjs2.default)(date).tz('Europe/London').format('dddd, MMM D');
  };

  return _react2.default.createElement(
    'div',
    {
      style: {
        padding: 8,
        backgroundColor: '#efefef',
        marginTop: 8,
        marginBottom: 8
      }
    },
    _react2.default.createElement(_Between2.default, {
      style: {
        left: {
          width: 104
        }
      },
      left: _react2.default.createElement(
        'a',
        {
          href: (0, _api.getFrontendURL)('/shop/' + order.product.slug + '/' + order.product.designer.slug)
        },
        _react2.default.createElement(_Img2.default, {
          style: { width: 96, height: 96 },
          src: (0, _api.getBackendURL)(order.product.images[0].url),
          alt: order.product.images[0].alternativeText
        })
      ),
      right: _react2.default.createElement(
        _Grid2.default,
        { style: { width: '100%' } },
        _react2.default.createElement(
          _Grid2.default.Row,
          null,
          _react2.default.createElement(_Between2.default, {
            left: _react2.default.createElement(
              _Grid2.default,
              null,
              _react2.default.createElement(
                _Grid2.default.Row,
                { style: { color: '#5f6368' } },
                'Rental Start:'
              ),
              _react2.default.createElement(
                _Grid2.default.Row,
                { style: { color: '#39603d', fontWeight: 700 } },
                formatDate(range.start)
              )
            ),
            right: _react2.default.createElement(
              _Grid2.default,
              null,
              _react2.default.createElement(
                _Grid2.default.Row,
                { style: { color: '#5f6368' } },
                'Rental End:'
              ),
              _react2.default.createElement(
                _Grid2.default.Row,
                { style: { color: '#39603d', fontWeight: 700 } },
                formatDate(range.end)
              )
            )
          })
        ),
        _react2.default.createElement(
          _Grid2.default.Row,
          null,
          _react2.default.createElement(_Between2.default, {
            left: _react2.default.createElement(
              'span',
              null,
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 700 } },
                order.size
              ),
              ' ',
              order.product.name,
              ' by',
              ' ',
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 700 } },
                order.product.designer.name
              )
            ),
            right: _react2.default.createElement(
              'div',
              { style: { fontWeight: 700 } },
              '\xA3',
              totalPrice
            )
          })
        )
      )
    })
  );
};

exports.default = Order;