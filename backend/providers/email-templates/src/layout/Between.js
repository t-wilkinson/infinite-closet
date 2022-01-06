import React from 'react'
import Grid from './Grid'

export const Between = ({ style = { left: {}, right: {} }, left, right }) => {
  const { left: leftStyle, right: rightStyle, ...mainStyle } = style
  return (
    <Grid style={{ ...mainStyle, marginBottom: 4, width: '100%' }}>
      <Grid.Row>
        <Grid.Cell style={{ ...leftStyle, textAlign: 'left' }}>
          {left}
        </Grid.Cell>
        <Grid.Cell style={{ ...rightStyle, textAlign: 'right' }}>
          {right}
        </Grid.Cell>
      </Grid.Row>
    </Grid>
  )
}

export default Between
