import React from 'react'
import { G } from './Grid'

export const Paragraph = ({ children, ...props }) => {
  return <G cellPadding={4} {...props}>
    {children}
  </G>
}

export const P = Paragraph

export default Paragraph
