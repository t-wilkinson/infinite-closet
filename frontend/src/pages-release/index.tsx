import Head from 'next/head'

import Home from '@/Home'
import Layout from '@/Layout'

const Page = () => {
  return (
    <>
      <Head>
        <title>Infinite closet</title>
      </Head>
      <Layout>
        <Home />
      </Layout>
    </>
  )
}

export default Page
