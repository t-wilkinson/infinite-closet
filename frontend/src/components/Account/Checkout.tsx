import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import { Input } from '@/Form'
import useFields from '@/Form/useFields'
import { fetchAPI } from '@/utils/api'

import CheckoutForm from './CheckoutForm'

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

type PaymentStatus = "failed" | "succeeded" | "processing" | "disabled"
type ShippingClass = 'one_day' | 'next_day' | 'two_day'

const initialState = {
  paymentMethods: [],
  address: null,
  paymentStatus: "disabled"  as PaymentStatus,
  shippingClass: 'two_day' as ShippingClass,
  error: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'choose-address': return {...state, address: action.payload}
    case 'add-payment-method': return {...state, paymentMethods: [...state.paymentMethods, action.payload]}
    case 'add-payment-methods': return {...state, paymentMethods: [...state.paymentMethods, ...action.payload]}
    case 'remove-payment-method': {
      const paymentMethods = [...state.paymentMethods]
      paymentMethods.splice(action.payload, 1)
      return {...state, paymentMethods}
    }
    case 'payment-error': return {...state, paymentStatus: "disabled", error: action.payload}
    case 'payment-succeeded': return {...state, paymentStatus: action.payload ?? "succeeded", error: null}
    case 'payment-failed': {
      let error
      if (action.payload.error?.message) { error =`Payment failed ${action.payload.error.message}` }
      else { error = `Payment failed` }
      return {...state, paymentStatus: "failed", error: error }
    }
    case 'payment-processing': return {...state, paymentStatus: "processing"}
    default: return state
  }
}

export const Checkout = ({ user, data }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const fields = {
    address: useFields({
      firstName: {},
      lastName: {},
      address: {},
      apt: { label: 'Apt / Unit / Suite (Optional)' },
      city: {},
      state: {},
      zipCode: { label: 'ZIP Code' },
      mobileNumber: {},
    }),
  }

  React.useEffect(() => {
    if (user) {
      dispatch({type: 'choose-address', payload: user && user.addresses && user.addresses[0]})

      fetchAPI('/stripe/payment_methods')
      .then((res) => dispatch({type: 'add-payment-methods', payload: res.paymentMethods}))
      .catch((err) => console.error(err))
    }
  }, [user])

  // TODO: allow guests
  if (!user) {
    return <div></div>
  }

  return (
    <div className="items-center max-w-screen-xl h-full">
      <div className="w-full">
        <Addresses fields={fields.address} addresses={user.addresses} state={state} />
        <PaymentMethods
          user={user}
          dispatch={dispatch}
          state={state}
        />
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

const Addresses = ({ fields, addresses, state}) => {
  return <div>
    <span>Addresses</span>
    {JSON.stringify(addresses)}
    <AddAddress fields={fields} />
  </div>
}

const AddAddress = ({ fields }) => {
  return (
    <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4">
      {Object.keys(fields).map((field) => (
        <Input key={field} {...fields[field]} />
      ))}
    </div>
  )
}

const PaymentMethods = ({ user, state, dispatch}) => {
  return (
    <div className="items-center w-full">
      {JSON.stringify(state.paymentMethods)}
      <Elements stripe={promise}>
        <CheckoutForm user={user} state={state} dispatch={dispatch} />
      </Elements>
    </div>
  )
}

const Summary = ({ cart }) => {
  return <> </>
}

export default Checkout
