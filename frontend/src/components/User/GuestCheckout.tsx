import React from 'react'
import axios from 'axios'
import { useStripe } from '@stripe/react-stripe-js'

import Cart from '@/Cart'
import { CartUtils } from '@/Cart/slice'
import { PaymentWrapper } from '@/Form/Payments'
import useFields, { cleanFields } from '@/Form/useFields'
import { validatePostcode } from '@/User/Address'
import { useAddressFields } from '@/User/Address'
import { BlueLink } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

import CheckoutForm from './GuestCheckoutForm'
import { Summary, useFetchCart } from './CheckoutUtils'
import {
  useCheckoutSuccess,
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
  const state = React.useContext(StateContext)
  const cartCount = useSelector((state) => state.cart.count)

  return (
    <div
      className="w-full justify-center max-w-screen-xl my-4 h-full
      md:flex-row space-y-4 md:space-y-0 md:space-x-4
      "
    >
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
          <PaymentRequest>
            <CheckoutForm />
          </PaymentRequest>
        </div>
      )}
    </div>
  )
}

export const PaymentRequest = ({ children }) => {
  const stripe = useStripe()
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const state = React.useContext(StateContext)
  const { couponCode } = React.useContext(FieldsContext)
  const [paymentRequest, setPaymentRequest] = React.useState(null)
  const [paymentIntent, setPaymentIntent] = React.useState(null)

  // Create/Update paymentintent
  React.useEffect(() => {
    if (paymentIntent) {
      axios
        .put(`/orders/checkout/payment-intents/${paymentIntent.id}`, {
          couponCode: couponCode.value,
          orders: cart.map((item) => item.order),
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.error) {
            throw res.error
          } else {
            setPaymentIntent(res)
          }
        })
        .catch(() => setPaymentIntent(null))
    } else {
      axios
        .post('/orders/checkout/payment-intents', {
          couponCode: couponCode.value,
          orders: cart.map((item) => item.order),
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.error) {
            throw res.error
          } else {
            setPaymentIntent(res)
          }
        })
        .catch(() => setPaymentIntent(null))
    }
  }, [cart, state.coupon])

  // Create paymentRequest
  React.useEffect(() => {
    if (!stripe || !paymentIntent || !summary) return
    const pr = stripe.paymentRequest({
      country: 'GB',
      currency: 'gbp',
      total: {
        label: 'Checkout total',
        amount: paymentIntent.amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: true,
      shippingOptions: [
        {
          id: 'default-shipping',
          label: 'Zero Emission Delivery',
          detail: 'Carbon-neutral shipping by Hived',
          amount: Math.round(summary.shipping * 100),
        },
      ],
    })

    // Check the availability of the Payment Request API.
    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr)
      }
    })
  }, [stripe, paymentIntent, summary])

  if (paymentRequest && paymentIntent) {
    return (
      <PaymentRequestContainer
        paymentRequest={paymentRequest}
        setPaymentRequest={setPaymentRequest}
        paymentIntent={paymentIntent}
      />
    )
  }

  // Use a traditional checkout form.
  return children
}

const PaymentRequestContainer = ({
  paymentRequest,
  setPaymentRequest,
  paymentIntent,
}) => {
  const stripe = useStripe()
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const fields = React.useContext(FieldsContext)
  const onCheckoutSuccess = useCheckoutSuccess()
  const dispatch = React.useContext(DispatchContext)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const state = React.useContext(StateContext)

  React.useEffect(() => {
    const { client_secret: clientSecret } = paymentIntent
    paymentRequest.on('paymentmethod', async (ev: any) => {
      // Confirm the PaymentIntent without handling potential next actions (yet).
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        )

      if (confirmError) {
        // Report to the browser that the payment failed, prompting it to
        // re-show the payment interface, or show an error message and close
        // the payment interface.
        ev.complete('fail')
      } else {
        // Report to the browser that the confirmation was successful, prompting
        // it to close the browser payment method collection interface.
        ev.complete('success')
        // Check if the PaymentIntent requires any actions and if so let Stripe.js
        // handle the flow. If using an API version older than "2019-02-11"
        // instead check for: `paymentIntent.status === "requires_source_action"`.

        const toCheckout = (ev: any) => {
          const cleanedFields = cleanFields(fields)
          return {
            couponCode: cleanedFields.couponCode,
            paymentMethod: ev.paymentMethod,
            email: ev.payerEmail,
            billing: {
              name: cleanedFields.billingName,
            },
            address: {
              name: ev.payerName,
              mobileNumber: ev.payerPhone,
              addressLine1: ev.shippingAddress.addressLine[0],
              addressLine2: ev.shippingAddress.addressLine[1],
              town: ev.shippingAddress.city,
              postcode: ev.shippingAddress.postalCode,
            },
          } as const
        }

        const checkout = () => {
          dispatch({ type: 'status-processing' })
          const info = toCheckout(ev)

          validatePostcode(info.address.postcode)
            .then(() =>
              axios.post('/orders/checkout-request', {
                address: info.address,
                email: info.email,
                couponCode: info.couponCode,
                orders: cart.map((item) => item.order),
                paymentMethod: info.paymentMethod.id,
                paymentIntent: paymentIntent.id,
              })
            )
            .then(onCheckoutSuccess)
            .catch((err) => {
              console.error(err)
              dispatch({ type: 'status-error' })
            })
        }

        if (paymentIntent.status === 'requires_action') {
          // Let Stripe.js handle the rest of the payment flow.
          const { error } = await stripe.confirmCardPayment(clientSecret)
          if (error) {
            // The payment failed -- ask your customer for a new payment method.
            setPaymentRequest(null)
          } else {
            // The payment has succeeded.
            checkout()
          }
        } else {
          // The payment has succeeded.
          checkout()
        }
      }
    })

    paymentRequest.on('shippingaddresschange', async function (ev: any) {
      if (
        process.env.NODE_ENV === 'test' ||
        process.env.NODE_ENV === 'production'
      ) {
        return axios
          .get(`/addresses/verify/${ev.shippingAddress.postalCode}`)
          .then((res) => {
            if (res.data.valid) {
              ev.updateWith({
                status: 'success',
                shippingOptions: {
                  id: 'default-shipping',
                  label: 'Zero Emission Delivery',
                  detail: 'Carbon-neutral shipping by Hived',
                  amount: Math.round(summary.shipping * 100),
                },
              })
            } else {
              throw new Error('Postcode not served')
            }
          })
          .catch(() => {
            ev.updateWith({ status: 'invalid_shipping_address' })
          })
      } else {
        ev.updateWith({
          status: 'success',
          shippingOptions: {
            id: 'default-shipping',
            label: 'Zero Emission Delivery',
            detail: 'Carbon-neutral shipping by Hived',
            amount: Math.round(summary.shipping * 100),
          },
        })
      }
    })
  }, [paymentRequest, paymentIntent])

  return (
    <>
      <Summary
        summary={summary}
        couponCode={fields.couponCode}
        dispatch={dispatch}
        coupon={state.coupon}
      />
      <PaymentRequestButton paymentRequest={paymentRequest} stripe={stripe} />
    </>
  )
}

const PaymentRequestButton = ({ paymentRequest, stripe }) => {
  const buttonContainer = React.useRef()
  React.useEffect(() => {
    const elements = stripe.elements()
    const buttonElement = elements.create('paymentRequestButton', {
      paymentRequest,
    })
    paymentRequest.canMakePayment().then((result: any) => {
      if (!result || !buttonContainer.current) {
        return
      }
      buttonElement.mount(buttonContainer.current)
    })
    return () => buttonElement.parentNode && buttonElement.destroy()
  }, [buttonContainer, stripe, paymentRequest])
  return <div ref={buttonContainer} />
}

export default CheckoutWrapper
