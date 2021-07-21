import React from 'react'
import Layout from '../layout'
import Order from '../elements/Order'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export default ({ data }) => {
  const formatDate = (date) =>
    dayjs(date).tz('Europe/London').format('dddd, MMM D')

  return (
    <Layout title="Order Shipped">
      <h3 style={{ margin: 0 }}>Hello {data.firstName},</h3>
      <span>Your order just shipped!</span>
      <span>
        Please expect it to arrive midday on{' '}
        <span style={{ color: '#39603d' }}>{formatDate(data.range.start)}</span>
        .
      </span>
      <Order {...data} />
      <span>We hope to see you again soon.</span>
    </Layout>
  )
}
