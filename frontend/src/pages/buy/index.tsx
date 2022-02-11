import React from 'react'

import UserCheckout from '@/Order/Checkout/User'
import GuestCheckout from '@/Order/Checkout/Guest'
import Layout from '@/Layout'
import { useSelector } from '@/utils/store'
import { FacebookMessenger } from '@/Components'

const Page = () => {
  const user = useSelector((state) => state.user.data)

  if (user === undefined) {
    return null
  } else if (user === null) {
    return (
      <Layout spacing={false}>
        {process.env.NODE_ENV === 'production' && <FacebookMessenger />}
        <GuestCheckout />
      </Layout>
    )
  } else {
    return (
      <Layout spacing={false}>
        {process.env.NODE_ENV === 'production' && <FacebookMessenger />}
        <UserCheckout />
      </Layout>
    )
  }
}

export default Page
