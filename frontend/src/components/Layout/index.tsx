import Head from 'next/head'

import Header from './Header'
import Footer from './Footer'

export const Layout = ({
  title = 'Infinite Closet',
  append = true,
  className = '',
  children,
  spacing = undefined,
}) => (
  <>
    <Head>
      <title>
        {append && title !== 'Infinite Closet'
          ? `${title} | Infinite Closet`
          : title}
      </title>
    </Head>
    <Header spacing={spacing} />
    <main tabIndex={0} className={`items-center flex-grow ${className}`}>
      {children}
    </main>
    <Footer />
  </>
)
export default Layout
