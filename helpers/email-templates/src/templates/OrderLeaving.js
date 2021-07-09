import React from 'react'
import Layout from '../layout'
import Order from '../elements/Order'

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
  return (
    <Layout title="Order Ending">
      <span className="font-bold text-xl">
        Hello <Var>name</Var>,
      </span>
      <span className="mb-2">Hope you enjoyed your order!</span>
      <span>Please expect a service to pick it up around midday today.</span>
      <div className="my-4">
        <Order {...data} />
      </div>
      <span>We hope to see you again soon.</span>
    </Layout>
  )
}
