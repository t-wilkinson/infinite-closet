import Head from 'next/head'

import { Divider } from '@/components'
import ComingSoon from '@/ComingSoon'
import Header from '@/Layout/Header'

const Page = () => {
  return (
    <>
      <Head>
        <title>More Coming Soon</title>
      </Head>
      <Header />
      <ComingSoon />
      <Divider />
    </>
  )
}

export default Page
