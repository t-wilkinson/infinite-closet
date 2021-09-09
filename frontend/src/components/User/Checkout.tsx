import React from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import { fmtPrice } from '@/utils/helpers'
import { fetchAPI } from '@/utils/api'
import { CouponCode } from '@/Form'
import useFields, { cleanFields } from '@/Form/useFields'
import { Button, BlueLink, Icon } from '@/components'
import { CartUtils } from '@/Cart/slice'

import { PaymentMethods, AddPaymentMethod } from './Payment'
import { Addresses, AddAddress } from './Address'
import Cart from '@/Cart'

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
}

const reducer = (state, action) => {
  const def = (key) => ({ ...state, [key]: action.payload })
  // prettier-ignore
  switch (action.type) {
    case 'correct-coupon': return def('coupon')
    case 'clear-coupon': return {...state, coupon: undefined,}

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

const StateContext = React.createContext(null)
const DispatchContext = React.createContext(null)

export const CheckoutWrapper = ({}) => {
  const user = useSelector((state) => state.user.data)
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const rootDispatch = useDispatch()
  const analytics = useAnalytics()
  const cart = useSelector((state) => state.cart.checkoutCart)

  const fetchCart = () => {
    rootDispatch(CartUtils.view())
    rootDispatch(CartUtils.summary())
  }

  React.useEffect(() => {
    analytics.logEvent('view_cart', {
      user: user ? user.email : 'guest',
    })
  }, [])

  React.useEffect(() => {
    rootDispatch(CartUtils.summary())
  }, [cart])

  React.useEffect(() => {
    fetchCart()

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

  return (
    <div className="w-full flex-grow items-center bg-gray-light px-4 pt-4">
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Checkout fetchCart={fetchCart} analytics={analytics} />
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
  )
}

const Checkout = ({ fetchCart, analytics }) => {
  const dispatch = React.useContext(DispatchContext)
  const state = React.useContext(StateContext)
  const cartCount = useSelector((state) => state.cart.count)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const user = useSelector((state) => state.user.data)
  const fields = useFields({
    couponCode: {},
  })
  const summary = useSelector((state) => state.cart.checkoutSummary)

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
          cart: cart.map((item) => item.order),
          couponCode: cleaned.couponCode,
        },
        { withCredentials: true }
      )
      .then(() => {
        fetchCart()
        dispatch({ type: 'status-success' })
        analytics.logEvent('purchase', {
          user: user ? user.email : 'guest',
          type: 'checkout',
        })
      })
      .catch((err) => {
        console.error(err)
        dispatch({ type: 'status-error' })
      })
  }

  return (
    <div
      className="w-full justify-center max-w-screen-xl my-4 h-full
      md:flex-row space-y-4 md:space-y-0 md:space-x-4
      "
    >
      <div className="md:w-2/5 space-y-4">
        <SideItem label="Addresses" user={user} protect>
          <Address user={user} state={state} dispatch={dispatch} />
        </SideItem>
        <SideItem label="Payment Methods" user={user} protect>
          <Payment user={user} state={state} dispatch={dispatch} />
        </SideItem>
        <SideItem label="Summary" user={user}>
          <Summary
            user={user}
            summary={summary}
            dispatch={dispatch}
            couponCode={fields.couponCode}
          />
        </SideItem>
      </div>
      {state.status === 'success' ? (
        <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-32">
          <span className="font-bold text-xl flex flex-col items-center">
            Thank you for your purchase!
          </span>
        </div>
      ) : cartCount === 0 ? (
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
        <div className="w-full space-y-4">
          <Cart />
          <Button
            onClick={checkout}
            disabled={
              !(state.paymentMethod && state.address) ||
              ['checking-out'].includes(state.status) ||
              cart.every(isOrderInvalid)
            }
          >
            {!state.address
              ? 'Please Select an Address'
              : !state.paymentMethod
              ? 'Please Select a Payment Method'
              : state.status === 'checking-out'
              ? 'Checkout Out...'
              : state.status === 'error'
              ? 'Oops... We ran into an issue'
              : state.status === 'success'
              ? 'Successfully Checked Out'
              : cart.every(isOrderInvalid)
              ? 'No Available Items'
              : cart.some(isOrderInvalid)
              ? 'Checkout Available Items'
              : 'Secure Checkout'}
          </Button>
        </div>
      )}
    </div>
  )
}

const isOrderInvalid = (order) => !order.valid

const SideItem = ({ label, children, user, protect = false }) =>
  protect && !user ? null : (
    <div className="space-y-2 bg-white p-3 rounded-sm relative">
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

const Summary = ({ user, couponCode, dispatch, summary }) => {
  if (!summary) {
    return <div />
  }
  const { coupon } = summary

  return (
    <div>
      <CouponCode
        price={summary.total}
        user={user.id}
        context="checkout"
        setCoupon={(coupon) =>
          dispatch({ type: 'correct-coupon', payload: coupon })
        }
        field={couponCode}
      />
      <Price label="Subtotal" price={summary.subtotal} />
      <Price label="Insurance" price={summary.insurance} />
      <Price label="Shipping" price={summary.shipping} />
      <Price
        negative
        label="Discount"
        price={summary.discount + (coupon?.discount || 0)}
      />
      <div className="h-px bg-pri my-1" />
      <Price
        label="Total"
        price={coupon?.price || summary.total}
        className="font-bold"
      />
    </div>
  )
}

const Price = ({ negative = false, label, price, className = '' }) => (
  <div className={`flex-row justify-between ${className}`}>
    <span>{label}</span>
    <span>
      {negative && '-'} {fmtPrice(price)}
    </span>
  </div>
)

export default CheckoutWrapper
