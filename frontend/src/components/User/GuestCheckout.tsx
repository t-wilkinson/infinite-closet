import React from 'react'

import Cart from '@/Cart'
import { CartUtils } from '@/Cart/slice'
import { PaymentWrapper } from '@/Form/Payments'
import useFields from '@/Form/useFields'
import { useAddressFields } from '@/User/Address'
import { BlueLink } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import { Warnings, OR } from '@/Form'

import CheckoutForm from './GuestCheckoutForm'
import { PaymentRequest, useFetchCart } from './CheckoutUtils'
import {
  DispatchContext,
  StateContext,
  FieldsContext,
  AddressContext,
  reducer,
  initialState,
} from './GuestCheckoutUtils'

export const CheckoutWrapper = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const rootDispatch = useDispatch()
  const analytics = useAnalytics()
  const cart = useSelector((state) => state.cart.checkoutCart)
  const fields = useFields({
    couponCode: {},
    email: { constraints: 'required string' },
    billingName: { constraints: 'required string' },
    password: { constraints: 'required password' },
  })
  const address = useAddressFields()
  const fetchCart = useFetchCart()

  React.useEffect(() => {
    analytics.logEvent('view_cart', {
      user: 'guest',
    })
  }, [])

  React.useEffect(() => {
    rootDispatch(CartUtils.summary())
  }, [cart])

  React.useEffect(() => {
    fetchCart()
  }, [])

  return (
    <div className="w-full flex-grow items-center bg-gray-light px-4 pt-4">
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <FieldsContext.Provider value={fields}>
            <AddressContext.Provider value={address}>
              <PaymentWrapper>
                <Checkout />
              </PaymentWrapper>
            </AddressContext.Provider>
          </FieldsContext.Provider>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
  )
}

const Checkout = () => {
  const [isVisible, setVisible] = React.useState(false)
  const state = React.useContext(StateContext)
  const dispatch = React.useContext(DispatchContext)
  const fields = React.useContext(FieldsContext)

  const cartCount = useSelector((state) => state.cart.count)
  const analytics = useAnalytics()
  const fetchCart = useFetchCart()
  const rootDispatch = useDispatch()
  // const summary = useSelector((state) => state.cart.checkoutSummary)

  const onCheckout = (contact) => {
    rootDispatch(CartUtils.set([]))
    fetchCart()
    dispatch({ type: 'change-contact', payload: contact })
    dispatch({ type: 'status-success' })
    analytics.logEvent('purchase', {
      user: 'guest',
      type: 'checkout',
    })
  }

  React.useEffect(() => {
    dispatch({ type: 'register-error', payload: ['Email is already taken'] })
  }, [])

  return (
    <div
      className="w-full justify-center max-w-screen-xl my-4 h-full
      md:flex-row space-y-4 md:space-y-0 md:space-x-4
      "
    >
      {state.status === 'success' ? (
        <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-16 pb-16">
          <span className="font-bold text-xl flex flex-col items-center">
            Thank you for your purchase!
          </span>
          {state.registerError && (
            <div className="my-4">
              <span>We could not create an account for you.</span>
              <Warnings warnings={state.error || []} />
            </div>
          )}
        </div>
      ) : cartCount === 0 ? (
        <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-32">
          <span className="font-bold text-xl flex flex-col items-center">
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
          <PaymentRequest
            setVisible={setVisible}
            couponCode={fields.couponCode}
            coupon={state.coupon}
            dispatch={dispatch}
            onCheckout={onCheckout}
          />
          {isVisible && <OR />}
          <CheckoutForm onCheckout={onCheckout} />
        </div>
      )}
    </div>
  )
}

export default CheckoutWrapper
