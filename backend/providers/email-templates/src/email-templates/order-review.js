import React from 'react'

import { P, Layout, Container } from '../layout'
import { Space, Separator, MailingList, Order } from '../components'

export default ({ data }) => {
  const { firstName, cartItem } = data

  return (
    <Layout title="Tell Us Whats Up">
      <Space n={1} />

      <P>
        <p>Hi {firstName},</p>
        <p>
          How was your rental experience? Please let us know how you liked your
          pieces -- We and other customers would love to know!
        </p>
      </P>

      <Separator />
      <Order {...cartItem} review />
      <Separator space={false} />

      <Space n={2} />

      <Container
        title="£5 For Your Thoughts"
        href=""
        button="Review Your Items"
      >
        <span style={{textAlign: 'center'}}>
          Your feedback helps us learn how we can improve! Write a product
          review for one or more of your rental items and recieve a £5 promo
          code for your next order.
        </span>
      </Container>

      <Space n={2} />
      <P>
        <p>We hope to see you again soon!</p>
        <p>The Infinite Closet Team<br />info@infinitecloset.co.uk</p>
      </P>
      <Space n={2} />

      <MailingList />
      <Space n={1} />
    </Layout>
  )
}
