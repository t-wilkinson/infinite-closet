import React from 'react'
import axios from 'axios'

import useFields from '@/Form/useFields'
import { fetchAPI } from '@/utils/api'

import { PaymentMethods, AddPaymentMethod } from './PaymentMethod'
import { Addresses } from './Address'

type PaymentStatus = 'failed' | 'succeeded' | 'processing' | 'disabled'

const initialState = {
  paymentMethod: null, // stripe payment method id
  paymentMethods: [],
  address: null,
  error: null,
  status: 'disabled' as PaymentStatus,
  cart: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'choose-address':
      return { ...state, address: action.payload }
    case 'fill-cart':
      return { ...state, cart: action.payload }
    case 'start-payment':
      return { ...state, clientSecret: action.payload }

    case 'choose-payment-method':
      return { ...state, paymentMethod: action.payload }
    case 'add-payment-method':
      return {
        ...state,
        paymentMethods: [...state.paymentMethods, action.payload],
      }
    case 'add-payment-methods':
      return {
        ...state,
        paymentMethods: [...state.paymentMethods, ...action.payload],
      }
    case 'remove-payment-method': {
      const paymentMethods = [...state.paymentMethods]
      paymentMethods.splice(action.payload, 1)
      return { ...state, paymentMethods }
    }

    case 'payment-error':
      return { ...state, paymentStatus: 'disabled', error: action.payload }
    case 'payment-succeeded':
      return {
        ...state,
        paymentStatus: action.payload ?? 'succeeded',
        error: null,
      }
    case 'payment-failed': {
      let error
      if (action.payload.error?.message) {
        error = `Payment failed ${action.payload.error.message}`
      } else {
        error = `Payment failed`
      }
      return { ...state, paymentStatus: 'failed', error: error }
    }
    case 'payment-processing':
      return { ...state, paymentStatus: 'processing' }

    default:
      return state
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

  const checkout = () => {
    dispatch({ type: 'payment-succeeded' })
    axios.post(
      '/orders/checkout',
      {
        address: state.address.id,
        paymentMethod: state.paymentMethod,
        cart: state.cart,
      },
      { withCredentials: true },
    )
  }

  React.useEffect(() => {
    if (user) {
      dispatch({
        type: 'choose-address',
        payload: user && user.addresses && user.addresses[0],
      })
      dispatch({ type: 'fill-cart', payload: user.cart })

      fetchAPI('/account/payment-methods')
        .then((res) =>
          dispatch({
            type: 'add-payment-methods',
            payload: res.paymentMethods,
          }),
        )
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
        <Addresses
          fields={fields.address}
          addresses={user.addresses}
          state={state}
          dispatch={dispatch}
        />
        <PaymentMethods user={user} dispatch={dispatch} state={state} />
        <AddPaymentMethod user={user} />
        <Summary cart={user.cart} />
      </div>
      <div className="w-full">
        <Cart cart={user.cart} />
        <button onClick={checkout}>Checkout</button>
      </div>
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

const Summary = ({ cart }) => {
  return <> </>
}

export default Checkout
