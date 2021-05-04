import Head from 'next/head'

import Header from './Header'
import Footer from './Footer'

const Page = ({ title = 'Infinite Closet', children }) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <Header />
    {children}
    <Footer />
  </>
)
export default Page
