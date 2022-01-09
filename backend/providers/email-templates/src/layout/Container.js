import React from 'react'

import G from './Grid'
import { ButtonLink } from '../components'

export const Container = ({title, href, button, children}) => {
  return (
    <G className="border border-gray" cellPadding={16}>
      <G className="text-center" cellPadding={4}>
        {title && <strong className="subheading text-center">{title}</strong>}
        {children}
        {button && <br />}
        {button && <ButtonLink href={href}>{button}</ButtonLink>}
      </G>
    </G>
  )
}

export default Container
