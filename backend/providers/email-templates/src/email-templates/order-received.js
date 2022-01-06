import React from 'react'

import { P, Layout } from '../layout'
import { Space, ReviewRequest } from '../components'

export default ({ data }) => {
  const {
    firstName,
  } = data

  return (
    <Layout
      title="Return Received"
      img="/media/photoshoot/blue-dress-mirror.png"
      separator
    >
      <P>
        <p>Hello {firstName},</p>
        <p>
          Your rentals have been recieved. We will check your items and let you
          know if there are any issues.
        </p>
        <p>Thanks again for shopping with us!</p>
      </P>
      <Space n={2} />
      <ReviewRequest />
      <Space n={1} />
    </Layout>
  )
}
