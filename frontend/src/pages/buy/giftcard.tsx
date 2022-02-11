import React from 'react'
import Image from 'next/image'

import axios from '@/utils/axios'
import dayjs from '@/utils/dayjs'
import Layout from '@/Layout'
import { useSelector } from '@/utils/store'
import { GiftCard, useGiftCardFields } from '@/Form/Payment'
import { DatePicker } from '@/Form/DatePicker'

export const Page = ({ data }) => {
  const user = useSelector((state) => state.user.data)
  const giftCardFields = useGiftCardFields({ user })
  const today = dayjs()

  return (
    <Layout>
        <DatePicker
          isValid={(date) => date.isSameOrAfter(today, 'day')}
          selectedDate={giftCardFields.get('deliveryDate')}
          visible={giftCardFields.get('dateSelectorVisible')}
        />
      <div className="w-full md:flex-row max-w-screen-xl md:space-x-4 my-8 px-4">
        <div className="w-full h-48 sm:h-64 md:h-128 relative mb-4">
          <Image
            src="/media/buy/gift-card.png"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <GiftCard fields={giftCardFields} paymentIntent={data.paymentIntent} />
      </div>
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
