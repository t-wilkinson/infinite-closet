import React from "react"
import { P, Layout } from '../layout'
import { Space, Order, Separator, ReviewRequest, MailingList } from '../components'

export default ({ data }) => {
  const {
    status,
    firstName,
    user,
  } = data
  return (
    <Layout title="Wardrobe Item Creation">
      <Space />
      <P>
        <h3>Hi {firstName},</h3>
          {status === 'success'
            ? <p>Your new wardrobe item is successfully created and as been added to your wardrobe!</p>
            : <p>We ran into an order uploading one of your wardrobe items. If this problem persists please contact our team at info@infinitecloset.co.uk.</p>
          }
      </P>
      <Separator />
    </Layout>
  )
}
