import React from 'react'

import Checkout from '@/User/Checkout'
import Layout from '@/Layout'
import { useSelector } from '@/utils/store'

const Page = () => {
  const user = useSelector((state) => state.user.data)

  if (user === undefined) {
    return null
  }

  return (
    <Layout spacing={false}>
      <Checkout />
    </Layout>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  }
}

export default Page
