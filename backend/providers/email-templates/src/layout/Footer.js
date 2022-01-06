import React from 'react'

import G from './Grid'
import { Link, Img } from '../components'
import { getFrontendURL } from '../utils/api'

const iconImageStyle = {
  width: 50,
  height: 50,
  display: 'inline-block',
}

const socialMedia = [
  {
    href: 'https://twitter.com/_infinitecloset',
    src: '/icons/twitter.png',
  },
  {
    href: 'https://www.instagram.com/infinitecloset.uk',
    src: '/icons/instagram.png',
  },
  {
    href: 'https://www.facebook.com/InfiniteClosetUK',
    src: '/icons/facebook.png',
  },
]

export const Legal = (props) => {
  return (
    <G {...props}>
      <G.Row style={{ textAlign: 'left' }}>
        <G.Cell>
          <Link href="https://infinitecloset.co.uk/en-US/privacy">PRIVACY</Link>{' '}
          |{' '}
          <Link href="https://infinitecloset.co.uk/en-US/terms-and-conditions">
            TERMS
          </Link>
        </G.Cell>
        <G.Cell style={{ textAlign: 'right' }}>© INFINITE CLOSET 2022</G.Cell>
      </G.Row>
    </G>
  )
}

export const Footer = () => {
  return (
    <G
      style={{
        fontSize: 14,
        color: '#5f6368',
        textAlign: 'center',
      }}
    >
      <G.Cell className="font-bold text-black">
        ENJOY FREE SHIPPING AND FREE RETURNS ON EVERY ORDER*
        <br />
        <br />
      </G.Cell>
      <G className="bg-sec text-white p-2" cellPadding={8}>
        <G cellPadding={4}>
          <G.Cell>
            *Free shipping on all 2-day shipping orders. 1-day and next day
            orders standard shipping rates apply. Other restrictions may apply.{' '}
            <Link href="https://infinitecloset.co.uk/en-US/terms-and-conditions">
              More Information.
            </Link>
          </G.Cell>
          <Link href="https://infinitecloset.co.uk">
            www.infinitecloset.co.uk
          </Link>
          <G.Cell>TAG US ON SOCIAL</G.Cell>
          <G cellPadding={16}>
            <G>
              <G.Row>
                {socialMedia.map(({ href, src }) => (
                  <G.Cell key={src} style={iconImageStyle}>
                    <Link href={href}>
                      <Img src={getFrontendURL(src)} />
                    </Link>
                  </G.Cell>
                ))}
              </G.Row>
            </G>
          </G>
        </G>
        <G.Cell>
          <Legal />
        </G.Cell>
      </G>
    </G>
  )
}

export default Footer
