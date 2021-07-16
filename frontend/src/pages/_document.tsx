import Document, { Html, Head, Main, NextScript } from 'next/document'

const DESCRIPTION = `London's premier independent designer rental platform, giving you access to sustainable and ethical luxury brands. IC's "unlimited" closet offers the latest trends, dry cleaning, and next day delivery. The fashion revolution is here.`

const icons = [16, 32, 72, 128, 512] as const

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
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Barlow:wght@200;300&family=Cinzel&family=Lato:wght@400;700&display=swap"
            rel="stylesheet"
          />

          <Icons rel="apple-touch-icon" sizes={[72, 128, 512]} />
          <Icons rel="icon" sizes={[16, 32]} />
          <Icons rel="apple-touch-startup-image" sizes={[1024]} />

          <meta
            name="p:domain_verify"
            content="4d7af672c9be421551d0e61eb19d60f2"
          />
          <meta
            name="facebook-domain-verification"
            content="wuxo0tqtkgp3bqbxaevv93a31m490y"
          />
          <meta property="og:site_name" content="Infinite Closet" />
          <meta property="og:locale" content="en_GB" />

          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                                                'https://connect.facebook.net/en_US/fbevents.js');
                                                  fbq('init', '240144681054333');
                                                fbq('track', 'PageView');
                                                `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=240144681054333&ev=PageView&noscript=1"
            />
          </noscript>
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
