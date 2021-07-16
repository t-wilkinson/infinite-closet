import Head from 'next/head'

import Header from './Header'
import Footer from './Footer'

export const Layout = ({
  title = 'Infinite Closet',
  append = true,
  className = '',
  children,
}) => (
  <>
    <Head>
      <title>
        {append && title !== 'Infinite Closet'
          ? `${title} | Infinite Closet`
          : title}
      </title>
    </Head>
    <Header />
    <main tabIndex={0} className={`items-center flex-grow ${className}`}>
      {children}
    </main>
    <Footer />
  </>
)
export default Layout
