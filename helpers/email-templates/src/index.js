import React from 'react'
import ReactDOM from 'react-dom'

import * as Checkout from './templates/Checkout'
import * as JoinLaunchParty from './templates/JoinLaunchParty'
import * as OrderArriving from './templates/OrderArriving'
import * as OrderLeaving from './templates/OrderLeaving'

import './inlined.css'

/**
 * This file is not used when rendering the email on the server.
 * It's the perfect place to include mock data for development.
 */

const orderData = {
  price: 30.13,
  size: 'MD',
  range: { start: '8/24/2020', end: '8/28/2020' },
  product: {
    name: 'Product',
    designer: {
      name: 'Designer',
    },
    images: [
      {
        url: 'https://ci6.googleusercontent.com/proxy/0i_xXUdxzuItZLDm1D_gMnKlbWwQGzeTJkobLx32DdFSHfnxDaJXpXYzol9sUEWpPoykOc9n9Ez5hBZKecHtI8ztei6z6CwJTUC-y2kQgKWzTegtLg8XCg6VZb_vS0pf=s0-d-e1-ft#https://images-na.ssl-images-amazon.com/images/I/81wajOO6mLL._AC_SR80,80_.jpg',
        alternativeText: 'Alt Text',
      },
    ],
  },
}

const data = {
  Checkout: [orderData, orderData],
  OrderArriving: orderData,
  OrderLeaving: orderData,
  JoinLaunchParty: {
    donation: 25.0,
    discount: 5,
  },
}

const emails = { Checkout, OrderArriving, OrderLeaving, JoinLaunchParty }
const Emails = () => {
  const [email, setEmail] = React.useState(Object.keys(data).slice(-1)[0])
  const Email = emails[email]

  return (
    <div>
      <nav className="flex-row justify-start space-x-2 border-b border-gray p-2">
        {Object.keys(emails).map((k) => (
          <button
            key={k}
            onClick={() => setEmail(k)}
            className={`hover:underline ${email === k ? 'font-bold' : ''}`}
          >
            {k}
          </button>
        ))}
      </nav>
      <div>{Email && <Email.Email data={data[email]} />}</div>
    </div>
  )
}

ReactDOM.render(<Emails />, document.getElementById('root'))
