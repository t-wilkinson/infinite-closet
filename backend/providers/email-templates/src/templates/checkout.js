import React from 'react'
import Grid from '../layout/Grid'
import Layout from '../layout'
import Order from '../elements/Order'
import Between from '../elements/Between'

export default ({ data, cart }) => {
  return (
    <Layout title="Checkout Confirmation">
      <h3 style={{ margin: 0 }}>Hello {data.firstName},</h3>
      <span>Thank you for your order.</span>

      <Grid style={{ marginTop: 8, marginBottom: 8 }}>
        {(data.cart || cart || data.data.cart).map((item, i) => (
          <Order key={i} {...item} />
        ))}
      </Grid>

      <Between
        left={<span style={{ fontWeight: 700 }}>Total</span>}
        right={
          <span style={{ fontWeight: 700 }}>£{data.totalPrice.toFixed(2)}</span>
        }
      />
      <span>We hope to see you again soon.</span>
    </Layout>
  )
}
