import React from 'react'

import G from './Grid'
import { ButtonLink } from '../components'

export const Container = ({ title, href, button, children }) => {
  return (
    <G
      align="center"
      cellPadding={16}
      style={{
        background: 'white',
        border: '1px solid #5f6368',
        width: 700,
      }}
      width="700"
    >
      <G style={{ textAlign: 'center' }} cellPadding={4} align="center">
        <G.Cell align="center">
          {title && (
            <strong
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '1.2em',
              }}
            >
              {title}
            </strong>
          )}
        </G.Cell>
        <G.Cell align="center">{children}</G.Cell>
        <G.Cell align="center">{button && <br />}</G.Cell>
        <G.Cell align="center">
          {button && <ButtonLink href={href}>{button}</ButtonLink>}
        </G.Cell>
      </G>
    </G>
  )
}

export default Container
