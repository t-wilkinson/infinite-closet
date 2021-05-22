import React from 'react'
import axios from 'axios'
import Image from 'next/image'
import dayjs from 'dayjs'
import 'dayjs/locale/en-gb'

import { fetchAPI, getURL } from '@/utils/api'
import { Submit } from '@/Form'
import { Divider, Icon, BlueLink } from '@/components'

import { PaymentMethods, AddPaymentMethod } from './PaymentMethod'
import { Addresses, AddAddress } from './Address'

type PaymentStatus = 'failed' | 'succeeded' | 'processing' | 'disabled'
type Popup = 'none' | 'address' | 'payment'

const initialState = {
  paymentMethod: undefined,
  paymentMethods: [],
  address: undefined,
  addresses: [],
  popup: 'none' as Popup,
  error: undefined,
  status: 'disabled' as PaymentStatus,
  cart: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'fill-cart':
      return { ...state, cart: action.payload }
    case 'remove-cart-item':
      return {
        ...state,
        cart: state.cart.filter((order) => order.id !== action.payload),
      }

    case 'edit-payment':
      return { ...state, popup: 'payment' }
    case 'edit-address':
      return { ...state, popup: 'address' }
    case 'close-popup':
      return { ...state, popup: 'none' }

    case 'choose-address':
      return { ...state, address: action.payload }
    case 'set-addresses':
      return { ...state, addresses: action.payload }

    case 'choose-payment-method':
      return { ...state, paymentMethod: action.payload }
    case 'add-payment-method':
      return {
        ...state,
        paymentMethods: [...state.paymentMethods, action.payload],
      }
    case 'set-payment-methods':
      return {
        ...state,
        paymentMethods: action.payload,
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

  const checkout = () => {
    dispatch({ type: 'payment-succeeded' })
    axios.post(
      '/orders/checkout',
      {
        address: state.address,
        paymentMethod: state.paymentMethod,
        cart: state.cart,
      },
      { withCredentials: true },
    )
  }

  React.useEffect(() => {
    if (user) {
      dispatch({
        type: 'set-addresses',
        payload: user.addresses,
      })
      if (user.addresses && user.addresses[0] && user.addresses[0].id) {
        dispatch({
          type: 'choose-address',
          payload: user.addresses[0].id,
        })
      }

      fetchAPI(`/orders/cart/${user.id}`)
        .then((data) => dispatch({ type: 'fill-cart', payload: data.cart }))
        .catch((err) => console.error(err))

      fetchAPI('/account/payment-methods')
        .then((res) => {
          dispatch({
            type: 'set-payment-methods',
            payload: res.paymentMethods,
          })
          if (
            res.paymentMethods &&
            res.paymentMethods[0] &&
            res.paymentMethods[0].id
          ) {
            dispatch({
              type: 'choose-payment-method',
              payload: res.paymentMethods[0].id,
            })
          }
        })
        .catch((err) => console.error(err))
    }
  }, [user])

  return (
    <div className="w-full items-center px-4 mb-8">
      <div className="w-full justify-center max-w-screen-xl h-full flex-row space-x-4">
        <div className="w-1/3">
          <Address state={state} dispatch={dispatch} user={user} />
          <Divider className="my-4" />
          <Payment state={state} dispatch={dispatch} user={user} />
          <Summary cart={state.cart} />
        </div>
        {state.cart.length === 0 ? (
          <div className="w-full items-center h-64 justify-center">
            <span className="font-bold text-xl flex flex-col items-center">
              <div>Hmm... Your cart looks empty. </div>
              <div>
                <BlueLink
                  href="/products/clothing"
                  label="Would you like to go shopping?"
                />
              </div>
            </span>
          </div>
        ) : (
          <div className="w-full">
            <Cart cart={state.cart} dispatch={dispatch} />
            <Submit onSubmit={checkout}>
              {state.cart.some((order) => order.available <= 0)
                ? 'Checkout Available Items'
                : 'Checkout'}
            </Submit>
          </div>
        )}
      </div>
    </div>
  )
}

const Address = ({ state, user, dispatch }) => (
  <div className="space-y-2">
    <Addresses addresses={user.addresses} state={state} dispatch={dispatch} />
    <AddAddress user={user} dispatch={dispatch} state={state} />
    <div className="">
      <button
        className="flex p-2 bg-white rounded-sm border border-gray justify-center"
        onClick={() => dispatch({ type: 'edit-address' })}
      >
        <span className="inline">Add Address</span>
      </button>
    </div>
  </div>
)

const Payment = ({ state, user, dispatch }) => (
  <div className="space-y-2">
    <PaymentMethods user={user} dispatch={dispatch} state={state} />
    <AddPaymentMethod user={user} state={state} dispatch={dispatch} />
    <div className="">
      <button
        className="flex p-2 bg-white rounded-sm border border-gray justify-center"
        onClick={() => dispatch({ type: 'edit-payment' })}
      >
        <span className="inline">Add Payment</span>
      </button>
    </div>
  </div>
)

const rentalLengths = {
  short: 4,
  long: 8,
}

const Cart = ({ dispatch, cart }) => {
  return (
    <div className="w-full">
      {cart.map((item) => (
        <CartItem key={item.id} dispatch={dispatch} {...item} />
      ))}
    </div>
  )
}

const CartItem = ({ dispatch, product, ...order }) => {
  const date = dayjs(order.date)
  const startDate = date.format('ddd, MMM D')
  const endDate = date
    .add(rentalLengths[order.rentalLength], 'day')
    .format('ddd, MMM D')
  const Bold = (props) => <span className="font-bold" {...props} />

  const removeItem = () => {
    axios
      .delete(`/orders/cart/${order.id}`, { withCredentials: true })
      .then((res) => dispatch({ type: 'remove-cart-item', payload: order.id }))
      .catch((err) => console.error(err))
  }

  return (
    <div
      className={`flex-row items-center border p-4 rounded-sm relative
        ${order.available <= 0 ? 'border-warning' : 'border-gray'}
      `}
    >
      <button
        onClick={removeItem}
        className="absolute top-0 right-0 m-2 cursor-pointer"
      >
        <Icon name="close" size={20} />
      </button>
      <div className="h-32 w-32 relative mr-4">
        <Image
          src={getURL(product.images[0].url)}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div>
        <span>
          {product.name} by <Bold>{product.designer.name}</Bold>
        </span>
        <span>
          {startDate} - {endDate}
        </span>
        <span>{order.size}</span>
        <span>
          <Bold>£{order.price}</Bold>
        </span>
      </div>
      <div className="flex-grow items-end">
        <span>
          {order.available === 1
            ? `There is ${order.available} item left. Order now before it's gone!`
            : order.available <= 0
            ? `There are no items left`
            : `There are ${order.available} items left`}
        </span>
      </div>
    </div>
  )
}

const Summary = ({ cart }) => {
  return <> </>
}

export default Checkout
