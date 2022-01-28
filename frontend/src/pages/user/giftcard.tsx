import React from 'react'
import Link from 'next/link'

import axios from '@/utils/axios'
import Layout from '@/Layout'
import User from '@/User'
import { StrapiGiftCard } from '@/types/models'
import { CopyToClipboard } from '@/components'
import { fmtPrice } from '@/utils/helpers'

type GiftCardValues = (StrapiGiftCard & { valueLeft: number })[]

const Heading = ({ children }) => (
  <h2 className="mt-8 font-bold text-3xl">{children}</h2>
)

export const Page = ({}) => {
  const [giftCards, setGiftCards] = React.useState<GiftCardValues>([])

  React.useEffect(() => {
    axios
      .get<GiftCardValues>('/giftcards')
      .then((giftCards) => setGiftCards(giftCards))
      .catch(() => setGiftCards([]))
  }, [])

  return (
    <Layout>
      <User allowGuest>
        <div className="w-full max-w-screen-sm">
          <Link href="/buy/giftcard">
            <a className="bg-pri w-full p-3 text-center font-bold text-white">
              Buy a Gift Card
            </a>
          </Link>
          <div className="mb-8">
            {giftCards?.length > 0 ? (
              <>
                <Heading>Your gift cards</Heading>
                <GiftCards giftCards={giftCards} />
              </>
            ) : null}
          </div>
        </div>
      </User>
    </Layout>
  )
}

const Price = ({ price }) => (
  <span className="font-bold">{fmtPrice(price)}</span>
)

const GiftCards = ({ giftCards }: { giftCards: GiftCardValues }) => {
  return (
    <div className="">
      {giftCards.map((giftCard) => (
        <div
          key={giftCard.id}
          className="flex-row justify-between items-center"
        >
          <span>
            <Price price={giftCard.valueLeft} /> left (
            <span className="text-gray">
              <Price price={giftCard.value} /> original value
            </span>
            ).
          </span>
          <CopyToClipboard value={giftCard.code} message="gift card code" />
        </div>
      ))}
    </div>
  )
}

export default Page
