import React from 'react'
import axios from 'axios'
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js'

import Cart from '@/Cart'
import { CartUtils } from '@/Cart/slice'
import { PaymentWrapper } from '@/Form/Payments'
import useFields, { cleanFields } from '@/Form/useFields'
import { validatePostcode } from '@/User/Address'
import { useAddressFields } from '@/User/Address'
import { BlueLink } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

import CheckoutForm, { Summary } from './GuestCheckoutForm'
import {
  DispatchContext,
  StateContext,
  FieldsContext,
  AddressContext,
  reducer,
  initialState,
  useFetchCart,
  useCheckoutSuccess,
} from './GuestCheckoutUtils'

export const CheckoutWrapper = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const rootDispatch = useDispatch()
  const analytics = useAnalytics()
  const cart = useSelector((state) => state.cart.checkoutCart)
  const fields = useFields({
    couponCode: {},
    email: { constraints: 'required string' },
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

          <PaymentRequestWrapper />
        </div>
      )}
    </div>
  )
}

const PaymentRequestWrapper = () => {
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
          cart: cart.map((item) => item.order),
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
          cart: cart.map((item) => item.order),
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
    if (!stripe || !paymentIntent || paymentRequest) return
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
      // requestShipping: true,
      // shippingOptions: [
      //   {
      //     id: 'default-shipping',
      //     label: 'Zero Emission Delivery',
      //     detail: 'Carbon-neutral shipping by Hived',
      //     amount: summary.shipping,
      //   },
      // ],
    })

    // Check the availability of the Payment Request API.
    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr)
      }
    })
  }, [stripe, paymentIntent])

  //   // Update paymentRequest with updated price total
  //   React.useEffect(() => {
  //     if (!stripe || !paymentRequest || !paymentIntent || !summary) return
  //       console.log('update price', paymentIntent.amount)
  //     paymentRequest.update({
  //       total: {
  //         label: 'Checkout total',
  //         amount: paymentIntent.amount,
  //       },
  //       // shippingOptions: [
  //       //   {
  //       //     id: 'default-shipping',
  //       //     label: 'Zero Emission Delivery',
  //       //     detail: 'Carbon-neutral shipping by Hived',
  //       //     amount: summary.shipping,
  //       //   },
  //       // ],
  //     })
  //   }, [paymentIntent, summary])

  if (paymentRequest && paymentIntent) {
    return (
      <PaymentRequest
        paymentRequest={paymentRequest}
        setPaymentRequest={setPaymentRequest}
        paymentIntent={paymentIntent}
      />
    )
  }

  // Use a traditional checkout form.
  return <CheckoutForm />
}

const PaymentRequest = ({
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
            name: ev.payerName,
            email: ev.payerEmail,
            phone: ev.payerPhone,
            couponCode: cleanedFields.couponCode,
            address: {
              address: ev.shippingAddress.addressLine.join(', '),
              town: ev.shippingAddress.city,
              postcode: ev.shippingAddress.postalCode,
              firstName: ev.payerName.split(' ')[0],
              lastName: ev.payerName.split(' ').slice(1).join(' '),
              mobileNumber: ev.payerPhone,
            },
            paymentMethod: ev.paymentMethod,
          } as const
        }

        const checkout = () => {
          dispatch({ type: 'status-processing' })
          const info = toCheckout(ev)

          validatePostcode(info.address.postcode)
            .then(() =>
              axios.post('/orders/checkout-request', {
                address: info.address,
                paymentMethod: info.paymentMethod.id,
                cart: cart.map((item) => item.order),
                couponCode: info.couponCode,
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
        })
      }
    })
  }, [paymentRequest, paymentIntent])

  return (
    <>
      <Summary summary={summary} />
      <PaymentRequestButtonElement
        options={{ paymentRequest }}
        onClick={() => {
          console.log('updating with', paymentIntent.amount)
          paymentRequest.update({
            total: {
              label: 'Checkout total',
              amount: paymentIntent.amount,
            },
          })
        }}
      />
    </>
  )
}

export default CheckoutWrapper
