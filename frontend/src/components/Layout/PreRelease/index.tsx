import Head from 'next/head'

import { Divider } from '@/components'
import Header from './Header'
import Footer from './Footer'

const Page = ({ title = 'Infinite Closet', children }) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <Header />
    {children}
    <Divider />
    <Footer />
  </>
)
export default Page
