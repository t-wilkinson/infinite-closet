import Head from 'next/head'

import Header from './Header'
import Footer from './Footer'

export const Layout = ({ title = 'Infinite Closet', children }) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <Header />
    <main id="main" tabIndex={0}>
      {children}
    </main>
    <Footer />
  </>
)
export default Layout
