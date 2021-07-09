import React from 'react'
import Layout from '../layout'
import Order from '../elements/Order'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const Var = ({ children }) => (
  <React.Fragment>
    {'{{ '}
    {children}
    {' }}'}
  </React.Fragment>
)

export const fetchData = () => {
  return []
}

export const Email = ({ data }) => {
  const formatDate = (date) =>
    dayjs(date).tz('Europe/London').format('dddd, MMM D')

  return (
    <Layout title="Order Arriving">
      <span className="font-bold text-xl">
        Hello <Var>name</Var>,
      </span>
      <span className="mb-2">Your order is arriving midday today!</span>
      <div className="my-4">
        <Order {...data} />
      </div>
      <span>
        Please expect the order to be picked up on{' '}
        <span className="text-sec">{formatDate(data.range.end)}</span>.
      </span>
    </Layout>
  )
}
