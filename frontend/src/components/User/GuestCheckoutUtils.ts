import React from 'react'
import axios from 'axios'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

import { CartUtils } from '@/Cart/slice'
import { validatePostcode } from '@/User/Address'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import { useFetchCart } from './CheckoutUtils'

type Status = null | 'checking-out' | 'error' | 'success'

export const initialState = {
  error: undefined,
  status: null as Status,
  authorised: false,
  coupon: undefined,
}

export const reducer = (state: typeof initialState, action: any) => {
  const def = (key: string) => ({ ...state, [key]: action.payload })
  // prettier-ignore
  switch (action.type) {
    case 'correct-coupon': return def('coupon')
    case 'clear-coupon': return {...state, coupon: undefined,}
    case 'authorise': return {...state, authorised: true}
    case 'un-authorise': return {...state, authorised: false}

    case 'set-payment-method': return def('paymentMethod')

    case 'status-clear': return {...state, status: null, error: ''}
    case 'status-processing': return {...state, status: 'processing'}
    case 'status-success': return {...state, status: 'success'}
    case 'status-error': return {...state, status: 'error', error: action.payload}

    default: return state
  }
}

export const StateContext = React.createContext(null)
export const DispatchContext = React.createContext(null)
export const FieldsContext = React.createContext(null)
export const AddressContext = React.createContext(null)

export const useCheckoutSuccess = () => {
  const analytics = useAnalytics()
  const fetchCart = useFetchCart()
  const rootDispatch = useDispatch()
  const dispatch = React.useContext(DispatchContext)

  return () => {
    rootDispatch(CartUtils.set([]))
    fetchCart()
    dispatch({ type: 'status-success' })
    analytics.logEvent('purchase', {
      user: 'guest',
      type: 'checkout',
    })
  }
}

export const useCheckout = () => {
  const cart = useSelector((state) => state.cart.checkoutCart)
  const dispatch = React.useContext(DispatchContext)
  const elements = useElements()
  const stripe = useStripe()
  const onCheckoutSuccess = useCheckoutSuccess()

  const checkout = ({ address, billing, email, couponCode }) => {
    dispatch({ type: 'status-processing' })

    validatePostcode(address.postcode)
      .then(() =>
        stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: { name: billing.name, email },
        })
      )

      .then((res) => {
        if (res.error) {
          return Promise.reject(res.error)
        } else {
          return axios.post('/orders/checkout', {
            contact: {
              email,
              fullName: address.fullName,
              nickName: address.fullName.split(' ')[0],
            },
            address,
            paymentMethod: res.paymentMethod.id,
            orders: cart.map((item) => item.order),
            couponCode,
          })
        }
      })

      .then((res) => res.data)
      .then((res) => handleServerResponse(res, stripe, dispatch))

      .then(onCheckoutSuccess)

      .catch((err) => {
        console.error(err)
        dispatch({ type: 'status-error' })
      })
  }

  return checkout
}

function handleServerResponse(response, stripe, dispatch) {
  if (response.error) {
    // Show error from server on payment form
    dispatch({ type: 'status-error', payload: 'Unable to process payment' })
  } else if (response.status === 'no-charge') {
    dispatch({ type: 'status-success' })
  } else if (response.requires_action) {
    // Use Stripe.js to handle required card action
    stripe
      .handleCardAction(response.payment_intent_client_secret)
      .then((res: any) =>
        handleStripeJsResult(res, stripe, dispatch, response.body)
      )
  } else {
    dispatch({ type: 'status-success' })
  }
}

function handleStripeJsResult(result, stripe, dispatch, body) {
  if (result.error) {
    dispatch({ type: 'status-error', payload: result.error })
  } else {
    // The card action has been handled
    // The PaymentIntent can be confirmed again on the server
    axios
      .post('/orders/checkout', {
        paymentIntent: result.paymentIntent.id,
        ...body,
      })
      .then((res) => handleServerResponse(res.data, stripe, dispatch))
  }
}
