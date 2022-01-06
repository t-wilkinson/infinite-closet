'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.G = exports.Grid = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * This grid allows you to be less verbose by only defining whay you need:
 *
 *    <Grid>
 *      <Grid.Row>
 *        <Grid.Cell>
 *          <p>Foo</p>
 *        </Grid.Cell>
 *      </Grid.Row>
 *    </Grid>
 *
 * Is equivalent of:
 *
 *    <Grid>
 *      <p>Foo</p>
 *    </Grid>
 *
 * Add the missing row and cell declaration are automatically added.
 *
 * Examples
 * --------
 *
 * Render two cells in a row
 *
 *    <Grid>
 *      <Grid.Row>
 *          <p>I'm in the first cell</p>
 *          <p>I'm in the second cell</p>
 *      </Grid.Row>
 *    </Grid>
 *
 * Render two paragraphs in a cell
 *
 *    <Grid>
 *      <Grid.Cell>
 *          <p>I'm in the first cell</p>
 *          <p>I'm in the second cell</p>
 *      </Grid.Cell>
 *    </Grid>
 *
 */

var tableStyle = {
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  }
};

var Cell = function Cell(_ref) {
  var children = _ref.children,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className,
      props = _objectWithoutProperties(_ref, ['children', 'style', 'className']);

  return _react2.default.createElement(
    'td',
    Object.assign({ style: style, className: className }, props),
    children
  );
};

var Row = function Row(_ref2) {
  var children = _ref2.children,
      _ref2$className = _ref2.className,
      className = _ref2$className === undefined ? '' : _ref2$className,
      _ref2$style = _ref2.style,
      style = _ref2$style === undefined ? {} : _ref2$style;

  return _react2.default.createElement(
    'tr',
    { className: className, style: style },
    _react2.default.Children.map(children, function (el) {
      if (el.type === Cell) return el;
      return _react2.default.createElement(
        'td',
        null,
        el
      );
    })
  );
};

var Grid = function Grid(_ref3) {
  var children = _ref3.children,
      _ref3$className = _ref3.className,
      className = _ref3$className === undefined ? '' : _ref3$className,
      _ref3$style = _ref3.style,
      style = _ref3$style === undefined ? {} : _ref3$style,
      props = _objectWithoutProperties(_ref3, ['children', 'className', 'style']);

  return _react2.default.createElement(
    'table',
    Object.assign({
      className: className,
      style: Object.assign({}, tableStyle.table, style)
    }, props),
    _react2.default.createElement(
      'tbody',
      null,
      _react2.default.Children.map(children, function (el) {
        if (!el) return;

        // We want this content the be on it's own row.
        if (el.type === Row) return el;

        // The content is all inside a single cell (so a row)
        if (el.type === Cell) {
          return _react2.default.createElement(
            'tr',
            null,
            el
          );
        }

        // The content is one cell inside it's own row
        return _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'td',
            null,
            el
          )
        );
      })
    )
  );
};

exports.Grid = Grid;
Grid.Row = Row;
Grid.Cell = Cell;

var G = exports.G = Grid;

exports.default = Grid;