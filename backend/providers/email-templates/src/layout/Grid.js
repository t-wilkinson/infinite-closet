import React from 'react'

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

const tableStyle = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: 0,
  },
}

const Cell = ({ children, style = {}, className = '', ...props }) => {
  return (
    <td style={style} className={className} {...props}>
      {children}
    </td>
  )
}

const Row = ({ children, className = '', style = {} }) => {
  return (
    <tr className={className} style={style}>
      {React.Children.map(children, (el) => {
        if (el.type === Cell) return el
        return <td>{el}</td>
      })}
    </tr>
  )
}

export const Grid = ({ children, className = '', style = {}, border, cellPadding, cellSpacing, ...props }) => {
  return (
    <table
      className={className}
      style={{ ...tableStyle.table, ...style}}
      cellPadding={cellPadding || "0"}
      cellSpacing={cellSpacing || "0"}
      {...props}
    >
      <tbody>
        {React.Children.map(children, (el) => {
          if (!el) return

          // We want this content the be on it's own row.
          if (el.type === Row) return el

          // The content is all inside a single cell (so a row)
          if (el.type === Cell) {
            return <tr>{el}</tr>
          }

          // The content is one cell inside it's own row
          return (
            <tr>
              <td>{el}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

Grid.Row = Row
Grid.Cell = Cell

export const G = Grid

export default Grid
