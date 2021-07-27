import React from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import useAnalytics from '@/utils/useAnalytics'
import { fmtPrice } from '@/utils/money'
import { fetchAPI } from '@/utils/api'
import { Coupon } from '@/Form/types'
import { Submit, CouponCode } from '@/Form'
import useFields, { cleanFields } from '@/Form/useFields'
import { BlueLink, Icon } from '@/components'

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
  coupon: undefined as Coupon,
}

const reducer = (state, action) => {
  const def = (key) => ({ ...state, [key]: action.payload })
  // prettier-ignore
  switch (action.type) {
    case 'correct-coupon': return def('coupon')
    case 'clear-coupon': return {...state, coupon: undefined,}

    case 'clear-insurance': return {...state, insurance: {}}
    case 'toggle-insurance': return {...state, insurance: {...state.insurance,  [action.payload]: !state.insurance[action.payload]}}

    case 'cart-total': return def('total')
    case 'fill-cart': return def('cart')
    case 'remove-cart-item': return { ...state, cart: state.cart.filter((order) => order.id !== action.payload), }

    case 'status-checkout': return {...state, status: 'checking-out'}
    case 'status-error': return {...state, status: 'error'}
    case 'status-success': return {...state, status: 'success'}

    case 'edit-payment': return { ...state, popup: 'payment' }
    case 'edit-address': return { ...state, popup: 'address' }
    case 'close-popup': return { ...state, popup: 'none' }

    case 'choose-address': return def('address')
    case 'set-addresses': return def('addresses')

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

export const Checkout = ({ user }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const fetchCart = () =>
    fetchAPI(`/orders/cart/${user.id}`)
      .then((data) => dispatch({ type: 'fill-cart', payload: data.cart }))
      .catch((err) => console.error(err))
  const analytics = useAnalytics()
  const fields = useFields({
    couponCode: {},
  })

  const checkout = () => {
    dispatch({ type: 'payment-succeeded' })
    dispatch({ type: 'status-checkout' })
    dispatch({ type: 'clear-coupon' })
    const cleaned = cleanFields(fields)
    axios
      .post(
        '/orders/checkout',
        {
          address: state.address,
          paymentMethod: state.paymentMethod,
          cart: state.cart,
          insurance: state.insurance,
          couponCode: cleaned.couponCode,
        },
        { withCredentials: true }
      )
      .then(() => {
        dispatch({ type: 'status-success' })
        dispatch({ type: 'clear-insurance' })
        analytics.logEvent('purchase', {
          user: user.email,
          type: 'checkout',
        })
        fetchCart()
      })
      .catch((err) => {
        console.error(err)
        dispatch({ type: 'status-error' })
      })
  }

  React.useEffect(() => {
    analytics.logEvent('view_cart', {
      user: user.email,
    })
  }, [])

  React.useEffect(() => {
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
  }, [user])

  React.useEffect(() => {
    axios
      .post(
        '/orders/cart/price',
        {
          insurance: state.insurance,
          cart: state.cart,
        },
        { withCredentials: true }
      )
      .then((res) => dispatch({ type: 'cart-total', payload: res.data }))
      .catch((err) => console.error(err))
  }, [state.cart, state.insurance])

  return (
    <div className="w-full flex-grow items-center bg-gray-light px-4">
      <div className="w-full justify-center max-w-screen-xl flex-row space-x-4 my-4 h-full">
        <div className="w-2/5 space-y-4">
          <SideItem label="Addresses">
            <Address state={state} dispatch={dispatch} user={user} />
          </SideItem>
          <SideItem label="Payment Methods">
            <Payment state={state} dispatch={dispatch} user={user} />
          </SideItem>
          <SideItem label="Summary">
            <Summary
              couponCode={fields.couponCode}
              state={state}
              dispatch={dispatch}
            />
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
                  label="Would you like to browse our collection?"
                />
              </div>
            </span>
          </div>
        ) : (
          <div className="w-full">
            <Cart
              cart={state.cart}
              remove={(id) =>
                dispatch({ type: 'remove-cart-item', payload: id })
              }
              toggleInsurance={(id) =>
                dispatch({ type: 'toggle-insurance', payload: id })
              }
              insurance={state.insurance}
            />
            <Submit
              onSubmit={checkout}
              className=""
              disabled={
                !(state.paymentMethod && state.address) ||
                ['checking-out'].includes(state.status) ||
                state.cart.every(isOrderInvalid)
              }
            >
              {!state.address
                ? 'Please Select an Address'
                : !state.paymentMethod
                ? 'Please Select a Payment Method'
                : state.status === 'checking-out'
                ? 'Checkout Out...'
                : state.status === 'error'
                ? 'Unable to Checkout'
                : state.status === 'success'
                ? 'Successfully Checked Out'
                : state.cart.every(isOrderInvalid)
                ? 'No Available Items'
                : state.cart.some(isOrderInvalid)
                ? 'Checkout Available Items'
                : 'Checkout'}
            </Submit>
          </div>
        )}
      </div>
    </div>
  )
}

const isOrderInvalid = (order) => !order.valid

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
    <Addresses
      userId={user.id}
      addresses={user.addresses}
      state={state}
      select={(id) => dispatch({ type: 'choose-address', payload: id })}
    />
    {state.popup === 'address' && (
      <div className="fixed inset-0 z-30 bg-black bg-opacity-50 items-center justify-center">
        <div className="w-full max-w-sm w-full p-6 bg-white rounded-lg relative">
          <div className="w-full items-center">
            <span className="font-bold text-3xl mt-2">Add Address</span>
          </div>

          <div className="w-full h-px bg-pri mb-6 mt-1 rounded-full" />

          <button
            className="absolute top-0 right-0 m-3"
            type="button"
            onClick={() => dispatch({ type: 'close-popup' })}
          >
            <Icon name="close" size={20} />
          </button>
          <AddAddress
            user={user}
            onSubmit={() => dispatch({ type: 'close-popup' })}
          />
        </div>
      </div>
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

const Summary = ({ couponCode, dispatch, state }) => {
  const { total } = state
  if (!total) {
    return <div />
  }

  return (
    <div>
      <CouponCode
        price={total.total}
        situation="checkout"
        setCoupon={(coupon) =>
          dispatch({ type: 'correct-coupon', payload: coupon })
        }
        field={couponCode}
      />
      <Price label="Subtotal" price={total.subtotal} />
      <Price label="Insurance" price={total.insurance} />
      <Price label="Shipping" price={total.shipping} />
      <div className="h-px bg-pri my-1" />
      <Price
        label="Total"
        price={state.coupon?.price || total.total}
        className="font-bold"
      />
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
