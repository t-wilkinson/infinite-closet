import React from 'react'
import Layout from '../layout'
import Order from '../components/Order'
import { fmtDate } from '../utils/date'

export default ({ data }) => {
  const { firstName, cartItem } = data

  return (
    <Layout title="Order Arriving">
      <h3 style={{ margin: 0 }}>Hello {firstName},</h3>
      <span>Your order is arriving today!</span>
      <br />
      <Order {...cartItem} />
      <span>
        Please expect the order to be picked up on{' '}
        <span style={{ color: '#39603d' }}>{fmtDate(cartItem.range.end)}</span>.
      </span>
    </Layout>
  )
}
