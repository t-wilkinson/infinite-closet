import React from 'react'

import UserCheckout from '@/User/Checkout'
import GuestCheckout from '@/User/GuestCheckout'
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

export default Page
