import Head from 'next/head'

import Header from './Header'
import Footer from './Footer'

export { Header } from './Header'
export { Footer } from './Footer'
export { Popup } from './Popup'
export { Modal } from './Modal'

export const Layout = ({
  title = 'Infinite Closet',
  append = true,
  className = '',
  children,
  spacing = true,
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
      {spacing && <div className="h-4" />}
      {children}
    </main>
    <Footer />
  </>
)

export default Layout
