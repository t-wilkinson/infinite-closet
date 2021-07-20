import React from 'react'
import Grid from '../layout/Grid'
import Layout from '../layout'
import Order from '../elements/Order'
import Between from '../elements/Between'

export default ({ data }) => {
  return (
    <Layout title="Checkout Confirmation">
      <h3 style={{ margin: 0 }}>Hello {data.firstName},</h3>
      <span>Thank you for your order.</span>

      <Grid style={{ marginTop: 8, marginBottom: 8 }}>
        {data.orders.map((order, i) => (
          <Order key={i} {...order} />
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
