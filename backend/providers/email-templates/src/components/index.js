import React from 'react'

import * as api from '../utils/api'

export * from './Order'
export * from './ReviewRequest'
export * from './MailingList'
export * from './Shop'

const withProvider = (url, provider) =>
  (url =
    provider === 'frontend'
      ? api.getFrontendURL(url)
      : provider === 'backend'
      ? api.getBackendURL(url)
      : // ? api.getFrontendURL(`/_next/image?url=${encodeURIComponent(api.getBackendURL(url))}&w=${1024}&q=75`)
        url)

export const ButtonLink = ({
  href,
  provider = 'frontend',
  children,
  style,
}) => {
  return (
      <table align="center" cellPadding={8}>
        <tr>
          <td bgcolor="#39603d">
            <a
              href={withProvider(href, provider)}
              style={{
                whiteSpace: 'nowrap',
                width: '100%',
                ...style,
              }}
              className="button-link font-body text-white"
            >
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              {children}
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            </a>
          </td>
        </tr>
      </table>
  )
}

export const Link = ({ href, provider = 'frontend', children }) => {
  return (
    <a href={withProvider(href, provider)} className="underline">
      {children}
    </a>
  )
}

const imgStyle = {
  img: {
    objectFit: 'contain',
    outline: 'none',
    textDecoration: 'none',
    border: 'none',
  },
}

export const Img = ({ src, alt, className = '', style = {}, provider }) => {
  return (
    <img
      src={withProvider(src, provider)}
      alt={alt}
      style={{ ...imgStyle.img, ...style }}
      className={className}
    />
  )
}

export const Separator = ({ space = true }) => {
  return (
    <React.Fragment>
      {space && <br />}
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td
              style={{
                background: 'none',
                border: 'solid 1px #cccccc',
                borderWidth: '1px 0 0 0',
                height: '1px',
                width: '100%',
                margin: '0px 0px 0px 0px',
              }}
            ></td>
          </tr>
        </tbody>
      </table>
      <br />
    </React.Fragment>
  )
}

export const Space = ({ n = 1 }) =>
  Array(n)
    .fill(null)
    .map((_, i) => <br key={i} />)

export const Heading = ({ children }) => (
  <center>
    <strong className="subheading">{children}</strong>
  </center>
)
