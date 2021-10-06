import React from 'react'
import Grid from '../layout/Grid'
import Layout from '../layout'
import Order from '../elements/Order'

export default ({ data }) => {
  return (
    <Layout title="Checkout Confirmation">
      <h3 style={{ margin: 0 }}>The following orders need to be shipped:</h3>

      <Grid style={{ marginTop: 8, marginBottom: 8 }}>
        {data.cart.map((item, i) => (
          <Order key={i} {...item} />
        ))}
      </Grid>
    </Layout>
  )
}
