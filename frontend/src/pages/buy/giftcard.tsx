import React from 'react'

import axios from '@/utils/axios'
import GiftCard from '@/Checkout/GiftCard'
import Layout from '@/Layout'
import User from '@/User'

export const Page = ({ data }) => {
  return (
    <Layout>
      <User allowGuest>
        <GiftCard data={data} />
      </User>
    </Layout>
  )
}

export async function getServerSideProps() {
  const [paymentIntent] = await Promise.all([
    await axios.post(
      '/giftcards/payment-intent',
      {
        value: 10,
      },
      { withCredentials: false }
    ),
  ])

  return {
    props: {
      data: {
        paymentIntent,
      },
    },
  }
}

export default Page
