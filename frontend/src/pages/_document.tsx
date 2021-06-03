import Document, { Html, Head, Main, NextScript } from 'next/document'

const DESCRIPTION = `London's premier independent designer rental platform, giving you access to sustainable and ethical luxury brands. IC's "unlimited" closet offers the latest trends, dry cleaning, and next day delivery. The fashion revolution is here.`

const icons = [16, 32, 72, 128, 512]

const Icons = ({ rel, sizes }) =>
  sizes.map((size) => (
    <link
      key={size}
      rel={rel}
      sizes={`${size}x${size}`}
      href={`/icons/logo-thick/logo-${size}.png`}
    />
  ))

const palette = {
  pri1: '#ad9253',
  pri2: '#e7ddcb',
  sec1: '#39603d',
  sec2: '#a3bcb6',
  black: '#000000',
  white: '#ffffff',
  red: '#ff3f22',
}

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en-gb">
        <Head>
          <meta name="application-name" content="Infinite Closet" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Infinite Closet" />
          <meta name="description" content={DESCRIPTION} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content={palette.pri1} />

          <link rel="manifest" href="/manifest.json" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Barlow:wght@200;300&family=Cinzel&family=Lato:wght@400;700&display=swap"
            rel="stylesheet"
          />

          <Icons rel="apple-touch-icon" sizes={[72, 128, 512]} />
          <Icons rel="icon" sizes={[16, 32]} />
          <Icons rel="apple-touch-startup-image" sizes={[1024]} />

          <meta property="og:site_name" content="Infinite Closet" />
          <meta property="og:locale" content="en_GB" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
