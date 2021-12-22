import React from 'react'

import axios from '@/utils/axios'
import { GiftCard, useGiftCardFields } from '@/Form/Payment'
import { StrapiGiftCard } from '@/types/models'
import { fmtPrice } from '@/utils/helpers'
import { CopyToClipboard } from '@/components'

type GiftCardValues = (StrapiGiftCard & { valueLeft: number })[]

const Heading = ({ children }) => (
  <h2 className="mt-8 font-bold text-3xl">{children}</h2>
)

export const GiftCardWrapper = ({ data }) => {
  const [giftCards, setGiftCards] = React.useState<GiftCardValues>([])
  const giftCardFields = useGiftCardFields()

  React.useEffect(() => {
    axios
      .get<GiftCardValues>('/giftcards')
      .then((giftCards) => setGiftCards(giftCards))
      .catch(() => setGiftCards([]))
  }, [])

  return (
    <div className="mb-8 max-w-screen-sm w-full">
      {giftCards?.length > 0 ? (
        <>
          <Heading>Your gift cards</Heading>
          <GiftCards giftCards={giftCards} />
        </>
      ) : null}
      <Heading>Purchase a gift card</Heading>
      <GiftCard fields={giftCardFields} paymentIntent={data.paymentIntent} />
    </div>
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

export default GiftCardWrapper
