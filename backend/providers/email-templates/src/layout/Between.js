import React from 'react'
import Grid from './Grid'

export const Between = ({ style = { left: {}, right: {} }, left, right }) => {
  const { left: leftStyle, right: rightStyle, ...mainStyle } = style
  return (
    <Grid width="100%" style={{ ...mainStyle, width: '100%', marginBottom: 4}}>
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
