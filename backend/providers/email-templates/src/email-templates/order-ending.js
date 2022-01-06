import React from 'react'

import { P, Layout } from '../layout'
import { Space, Order, Separator, ReviewRequest, MailingList } from '../components'
import { fmtDate } from '../utils'

export default ({ data }) => {
  const {
    cartItem,
    firstName,
    user,
  } = data

  return (
    <Layout title="Order Ending">
      <Space />
      <P>
        <h3>Hi {firstName},</h3>
        <p>
          We hope you’ve enjoyed your rental! This is your reminder to please be
          sure to take your items and garment bag to your nearest Royal Mail by{' '}
          <strong>{fmtDate(cartItem.range.end)}</strong> to avoid any late fees. Your return label can be
          found in your package.
        </p>
      </P>
      <Separator />
      <Order {...cartItem} />
      <Separator space={false}/>
      <Space n={2} />

      <ReviewRequest />
      <Space n={2} />
      <P>
        <p>
          Any issues with your order or return? Please contact Customer Service
          at info@infinitecloset.co.uk or on Whatsapp +44 7521 933225.
        </p>
        <p>Thanks for shopping with us!</p>
        <p>Best,</p>
        <strong>Team Infinite Closet</strong>
      </P>
      <Space n={2} />
      <MailingList />
      <script
        type="application/json+trustpilot"
        dangerouslySetInnerHTML={{
          __html: `
{
"recipientName": "${user.firstName} ${user.lastName}",
"recipientEmail": "${user.email}",
"referenceId": "${cartItem.order.id}"
}
        `,
        }}
      />
    </Layout>
  )
}
