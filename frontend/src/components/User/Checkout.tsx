import React from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { fmtPrice } from '@/utils/money'
import { fetchAPI } from '@/utils/api'
import { Submit } from '@/Form'
import { BlueLink } from '@/components'

import { PaymentMethods, AddPaymentMethod } from './Payment'
import { Addresses, AddAddress } from './Address'
import Cart from './Cart'

type Popup = 'none' | 'address' | 'payment'
type Status = null | 'checking-out' | 'error' | 'success'

const initialState = {
  paymentMethod: undefined,
  paymentMethods: [],
  address: undefined,
  addresses: [],
  popup: 'none' as Popup,
  error: undefined,
  status: null as Status,
  cart: [],
  insurance: {},
  total: undefined,
}

const reducer = (state, action) => {
  // prettier-ignore
  switch (action.type) {
    case 'toggle-insurance': return {...state, insurance: {...state.insurance,  [action.payload]: !state.insurance[action.payload]}}

    case 'cart-total': return {...state, total: action.payload}
    case 'fill-cart': return { ...state, cart: action.payload }
    case 'remove-cart-item': return { ...state, cart: state.cart.filter((order) => order.id !== action.payload), }

    case 'status-checkout': return {...state, status: 'checking-out'}
    case 'status-error': return {...state, status: 'error'}
    case 'status-success': return {...state, status: 'success'}

    case 'edit-payment': return { ...state, popup: 'payment' }
    case 'edit-address': return { ...state, popup: 'address' }
    case 'close-popup': return { ...state, popup: 'none' }

    case 'choose-address': return { ...state, address: action.payload }
    case 'set-addresses': return { ...state, addresses: action.payload }

    case 'choose-payment-method': return { ...state, paymentMethod: action.payload }
    case 'add-payment-method': return { ...state, paymentMethods: [...state.paymentMethods, action.payload], }
    case 'set-payment-methods': return { ...state, paymentMethods: action.payload, }
    case 'remove-payment-method': {
      const paymentMethods = [...state.paymentMethods].splice(action.payload, 1)
      return { ...state, paymentMethods }
    }

    case 'payment-error': return { ...state, paymentStatus: 'disabled', error: action.payload }
    case 'payment-succeeded': return { ...state, paymentStatus: action.payload ?? 'succeeded', error: null, }
    case 'payment-processing': return { ...state, paymentStatus: 'processing' }
    case 'payment-failed': {
      let error: string
      if (action.payload.error?.message) {
        error = `Payment failed ${action.payload.error.message}`
      } else {
        error = `Payment failed`
      }
      return { ...state, paymentStatus: 'failed', error: error }
    }

    default: return state
  }
}

export const Checkout = ({ user, data }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const fetchCart = () =>
    fetchAPI(`/orders/cart/${user.id}`)
      .then((data) => dispatch({ type: 'fill-cart', payload: data.cart }))
      .catch((err) => console.error(err))

  const checkout = () => {
    dispatch({ type: 'payment-succeeded' })
    dispatch({ type: 'status-checkout' })
    axios
      .post(
        '/orders/checkout',
        {
          address: state.address,
          paymentMethod: state.paymentMethod,
          cart: state.cart,
          insurance: state.insurance,
        },
        { withCredentials: true },
      )
      .then((res) => {
        dispatch({ type: 'status-success' })
        fetchCart()
      })
      .catch((err) => {
        console.error(err)
        dispatch({ type: 'status-error' })
      })
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

      fetchCart()

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

  React.useEffect(() => {
    axios
      .post('/orders/cart/total/price', {
        insurance: state.insurance,
        cart: state.cart,
      })
      .then((res) => dispatch({ type: 'cart-total', payload: res.data }))
      .catch((err) => console.error(err))
  }, [state.cart, state.insurance])

  return (
    <div className="w-full items-center bg-gray-light px-4">
      <div className="w-full justify-center max-w-screen-xl flex-row space-x-4 my-4 h-full">
        <div className="w-2/5 space-y-4">
          <SideItem label="Addresses">
            <Address state={state} dispatch={dispatch} user={user} />
          </SideItem>
          <SideItem label="Payment Methods">
            <Payment state={state} dispatch={dispatch} user={user} />
          </SideItem>
          <SideItem label="Summary">
            <Summary state={state} />
          </SideItem>
        </div>
        {state.status === 'success' ? (
          <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-32">
            <span className="font-bold text-xl flex flex-col items-center">
              Thank you for your purchase!
            </span>
          </div>
        ) : state.cart.length === 0 ? (
          <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-32">
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
            <Cart
              cart={state.cart}
              dispatch={dispatch}
              insurance={state.insurance}
            />
            <Submit
              onSubmit={checkout}
              className=""
              disabled={
                !(state.paymentMethod && state.address) ||
                ['checking-out'].includes(state.status) ||
                state.cart.every(isOrderValid)
              }
            >
              {state.status === 'checking-out'
                ? 'Checkout Out...'
                : state.status === 'error'
                ? 'Unable to Checkout'
                : state.status === 'success'
                ? 'Successfully Checked Out'
                : state.cart.every(isOrderValid)
                ? 'No Available Items'
                : state.cart.some(isOrderValid)
                ? 'Checkout Available Items'
                : 'Checkout'}
            </Submit>
          </div>
        )}
      </div>
    </div>
  )
}

const isOrderValid = (order) => order.available <= 0 || !order.dateValid

const SideItem = ({ label, children }) => (
  <div className="space-y-2 bg-white p-3 rounded-sm ">
    <span className="font-subheader text-xl lg:text-2xl my-2">
      {label}
      <div className="w-full h-px bg-pri mt-2 -mb-2" />
    </span>
    {children}
  </div>
)

const Address = ({ state, user, dispatch }) => (
  <>
    <Addresses addresses={user.addresses} state={state} dispatch={dispatch} />
    {state.popup === 'address' && (
      <AddAddress user={user} dispatch={dispatch} state={state} />
    )}
    <div className="h-0" />
    <button
      className="flex p-2 bg-white rounded-sm border border-gray justify-center"
      onClick={() => dispatch({ type: 'edit-address' })}
    >
      <span className="inline">Add Address</span>
    </button>
  </>
)

const Payment = ({ state, user, dispatch }) => (
  <>
    <PaymentMethods user={user} dispatch={dispatch} state={state} />
    <AddPaymentMethod user={user} state={state} dispatch={dispatch} />
    <button
      className="flex p-2 bg-white rounded-sm border border-gray justify-center"
      onClick={() => dispatch({ type: 'edit-payment' })}
    >
      <span className="inline">Add Payment</span>
    </button>
  </>
)

const Summary = ({ state: { total } }) => {
  if (!total) {
    return <div />
  }

  return (
    <div>
      <Price label="Subtotal" price={total.subtotal} />
      <Price label="Insurance" price={total.insurance} />
      <div className="h-px bg-pri my-1" />
      <Price label="Total" price={total.total} className="font-bold" />
    </div>
  )
}

const Price = ({ label, price, className = '' }) => (
  <div className={`flex-row justify-between ${className}`}>
    <span>{label}</span>
    <span>{fmtPrice(price)}</span>
  </div>
)

export default Checkout
