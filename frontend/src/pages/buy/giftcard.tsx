import React from 'react'

import axios from '@/utils/axios'
import GiftCard from '@/Checkout/GiftCard'
import Layout from '@/Layout'

export const Page = ({ data }) => {
  return (
    <Layout>
      <GiftCard data={data} />
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
