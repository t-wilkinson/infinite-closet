import React from 'react'

import UserCheckout from '@/User/Checkout'
import GuestCheckout from '@/Guest/Checkout'
import Layout from '@/Layout'
import { useSelector } from '@/utils/store'

const Page = () => {
  const user = useSelector((state) => state.user.data)

  if (user === undefined) {
    return null
  } else if (user === null) {
    return (
      <Layout spacing={false}>
        <GuestCheckout />
      </Layout>
    )
  } else {
    return (
      <Layout spacing={false}>
        <UserCheckout />
      </Layout>
    )
  }
}

export const getServerSideProps = async () => {
  return {
    props: {},
  }
}

export default Page
