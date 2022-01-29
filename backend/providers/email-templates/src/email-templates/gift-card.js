import React from 'react'

import { P, Layout } from '../layout'
import {
  YouMayAlsoLike,
  Heading,
  Space,
  Separator,
  MailingList,
} from '../components'
import { fmtPrice } from '../utils'

export default ({ data }) => {
  const { recommendations, giftCard, firstName } = data
  return (
    <Layout
      title="You've Received a Gift Card"
      src="/photoshoot/ping-dress-mirror.png"
    >
      <Space n={1} />

      <Separator />
      <P>
        <p>Hello {firstName},</p>
        <p>
          You’ve recieved a gift card! Your {fmtPrice(giftCard.value)} gift card code is{' '}
          <strong>{giftCard.code}</strong>. Use the code in the discount section during your next checkout.
        </p>
      </P>

      <Space n={3} />
      <Heading>Ready to shop?</Heading>
      <Separator />
      <YouMayAlsoLike recommendations={recommendations} />

      <MailingList />
    </Layout>
  )
}
