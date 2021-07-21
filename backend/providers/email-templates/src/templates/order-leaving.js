import React from 'react'
import Layout from '../layout'
import Order from '../elements/Order'

export default ({ data }) => {
  return (
    <Layout title="Order Ending">
      <h3 style={{ margin: 0 }}>Hello {data.firstName},</h3>
      <span>Hope you enjoyed your order!</span>
      <span>Please expect it to be picked up around midday today.</span>
      <Order {...data} />
      <span>We hope to see you again soon.</span>
    </Layout>
  )
}
