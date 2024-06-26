import React from 'react'

import { Separator, Img } from '../components'
import G from './Grid'
import Footer from './Footer'

export * from './Footer'
export * from './Between'
export * from './Grid'
export * from './Container'
export * from './Paragraph'

// export const Center = ({children}) =>
//   <G width="100%" align="center">
//     <G.Cell align="center">
//         {children}
//     </G.Cell>
//   </G>

export const Layout = ({ title, children, footer = true, img, separator }) => (
  <G
    bgcolor="#e7ddcb"
    width="100%"
    align="center"
    style={{
      width: '100%',
    }}
  >
    <G.Cell align="center">
      <G
        bgcolor="#ffffff"
        width="100%"
        align="center"
        style={{ width: '100%', maxWidth: 1000 }}
      >
        <G.Row>
          <G>
            <G.Cell align="center">
              {img && (
                <Img
                  src={img}
                  provider="frontend"
                  width="600"
                  style={{
                    width: '600',
                    minWidth: '600',
                  }}
                />
              )}
              <br />
              <Img
                provider="frontend"
                src={'/media/brand/infinite-closet-text.png'}
                width="300"
                style={{
                  width: '300',
                  minWidth: '300',
                }}
              />
              <br />
              <span
                style={{ fontSize: 20, fontWeight: 700, textAlign: 'right' }}
              >
                {title.toUpperCase()}
              </span>
            </G.Cell>
          </G>
        </G.Row>
        <G.Cell align="center">
          {separator && <Separator />}
          <G style={{ width: 700 }} width="700" align="center">
            {children}
          </G>
          <br />
          {footer && <Footer />}
        </G.Cell>
      </G>
    </G.Cell>
  </G>
)

export default Layout
