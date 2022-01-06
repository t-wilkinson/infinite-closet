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
  const { recommendations, amount, firstName } = data
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
          You’ve recieved a gift card! Your {fmtPrice(amount)} credit has been
          applied to your account and will be automatically applied to your next
          rental.
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
