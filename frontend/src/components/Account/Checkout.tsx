import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import { Input } from '@/Form'
import useFields from '@/Form/useFields'
import { fetchAPI } from '@/utils/api'

import CheckoutForm from './CheckoutForm'

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

export const Checkout = ({ user, data }) => {
  const [paymentMethods, setPaymentMethods] = React.useState()

  React.useEffect(() => {
    if (user) {
      fetchAPI('/stripe/payment_methods')
        .then((res) => setPaymentMethods(res))
        .catch((err) => console.error(err))
    }
  }, [])

  if (!user) {
    return <div></div>
  }

  if (user.cart.length === 0) {
    return <div></div>
  }

  return (
    <div className="items-center max-w-screen-xl h-full">
      <div className="w-full">
        <Addresses addresses={user.addresses} />
        <PaymentMethods user={user} paymentMethods={paymentMethods || []} />
        <Summary cart={user.cart} />
      </div>
      <Cart cart={user.cart} />
    </div>
  )
}

const Cart = ({ cart }) => {
  return (
    <div>
      {cart.map((cartItem) => (
        <div key={cartItem.id}>{JSON.stringify(cartItem)}</div>
      ))}
    </div>
  )
}

const Addresses = ({ addresses }) => {
  if (addresses.length === 0) {
    return <AddAddress />
  }
  return <div></div>
}

const AddAddress = (props) => {
  const fields = useFields({
    firstName: {},
    lastName: {},
    address: {},
    apt: { label: 'Apt / Unit / Suite (Optional)' },
    city: {},
    state: {},
    zipCode: { label: 'ZIP Code' },
    mobileNumber: {},
  })

  return (
    <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4">
      {Object.keys(fields).map((field) => (
        <Input key={field} {...fields[field]} />
      ))}
    </div>
  )
}

const PaymentMethods = ({ user, paymentMethods }) => {
  return (
    <div className="items-center w-full">
      <Elements stripe={promise}>
        <CheckoutForm user={user} />
      </Elements>
    </div>
  )
}

const AddPaymentMethod = () => {
  const fields = useFields({
    firstName: {},
    lastName: {},
    address: {},
    apt: { label: 'Apt / Unit / Suite (Optional)' },
    city: {},
    state: {},
    zipCode: { label: 'ZIP Code' },
    mobileNumber: {},
  })

  return (
    <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4">
      {Object.keys(fields).map((field) => (
        <Input key={field} {...fields[field]} />
      ))}
    </div>
  )
}

const Summary = ({ cart }) => {
  return <> </>
}

export default Checkout
