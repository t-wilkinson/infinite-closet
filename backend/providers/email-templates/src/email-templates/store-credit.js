import React from 'react'

import { P, Layout, G } from '../layout'
import { Heading, YouMayAlsoLike, Space, MailingList, Separator } from '../components'
import { fmtPrice } from '../utils'

export default ({ data }) => {
  const { recommendations, firstName, amount } = data
  return (
    <Layout
      title="You Have Store Credit"
      img="/media/photoshoot/pink-dress-mirror.png"
    >
      <Separator />
      <G cellPadding={8}>
        <P>
          <p>Hello {firstName},</p>
          <p>
            You’ve recieved store credit! Your {fmtPrice(amount)} credit has
            been applied to your account and will be automatically applied to
            your next rental.
          </p>
        </P>
      </G>
      <Space n={2} />

      <Heading>Ready to shop?</Heading>
      <Separator />
      <YouMayAlsoLike recommendations={recommendations} />
      <MailingList />
    </Layout>
  )
}
