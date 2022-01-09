import React from 'react'

import { Separator, Img } from '../components'
import G from './Grid'
import Footer from './Footer'

export * from './Footer'
export * from './Between'
export * from './Grid'
export * from './Container'
export * from './Paragraph'

export const Layout = ({ title, children, footer = true, img, separator }) => (
  <G
    bgcolor="#e7ddcb"
    style={{
      width: '100%',
    }}
  >
    <center>
      <G bgcolor="#ffffff" style={{ width: 800 }}>
        <G.Row>
          <G>
            <center>
              {img && (
                <Img
                  src={img}
                  provider="frontend"
                  style={{
                    width: 600,
                  }}
                />
              )}
              <br />
              <Img
                style={{
                  width: 300,
                }}
                provider="frontend"
                src={'/media/brand/infinite-closet-text.png'}
              />
              <br />
              <span
                style={{ fontSize: 20, fontWeight: 700, textAlign: 'right' }}
              >
                {title.toUpperCase()}
              </span>
            </center>
          </G>
        </G.Row>
        <center>
          <G style={{ width: 600 }}>
            {separator && <Separator />}
          {children}
          </G>
          <br />
          {footer && <Footer />}
        </center>
      </G>
    </center>
  </G>
)

export default Layout
