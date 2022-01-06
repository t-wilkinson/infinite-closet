import React from 'react'
import { Layout, Grid } from '../layout'
import Order from '../components/Order'

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
