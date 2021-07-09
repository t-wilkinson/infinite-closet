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
    <Layout title="Checkout Confirmation">
      <span className="font-bold text-xl">
        Hello <Var>name</Var>,
      </span>
      <span className="mb-2">Thank you for your order.</span>
      <div className="my-4">
        {data.map((order, i) => (
          <React.Fragment key={i}>
            {i !== 0 && <div className="w-full h-1 bg-white" />}
            <Order {...order} />
          </React.Fragment>
        ))}
      </div>
      <span>We hope to see you again soon.</span>
    </Layout>
  )
}
