import React from 'react'

import { P, Layout } from '../layout'
import { Space, Separator, Link, MailingList, Order } from '../components'

export default ({ data }) => {
  const { firstName, cartItem } = data
  return (
    <Layout title="Your Order Has Shipped">
      <P>
        <p>Hi {firstName},</p>
        <p>
          Your order has shipped! Get ready for your rental! You can find more
          details about your order in your <Link href="/user/order-history">account</Link>.
        </p>
        <br />
        <p>
          Any issues with your order? Please contact Customer Service at
          info@infinitecloset.co.uk or on Whatsapp +44 7521 933225. They will
          arrange an exchange or provide you with rental credit to use on a
          future order. If you have multiple orders, you don’t need to return
          the unworn item earlier - just please return everything together at
          the end of your rental period.
        </p>
        <p>Thanks for shopping with us!</p>
        <p>Best,</p>
        <strong>Team Infinite Closet</strong>
      </P>
      <Separator />
      <Order {...cartItem} />
      <Separator space={false} />
      <Space />
      <MailingList />
    </Layout>
  )
}
