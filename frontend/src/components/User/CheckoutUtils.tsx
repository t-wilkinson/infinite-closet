import React from 'react'
import axios from 'axios'
import { useStripe } from '@stripe/react-stripe-js'

import { useSelector, useDispatch } from '@/utils/store'
import { validatePostcode } from '@/User/Address'
import { cleanField } from '@/Form/useFields'
import { CouponCode } from '@/Form'
import { CartUtils } from '@/Cart/slice'
import { fmtPrice } from '@/utils/helpers'

export const Summary = ({
  userId = undefined,
  summary,
  couponCode,
  setCoupon,
  coupon,
}) => {
  if (!summary) {
    return <div />
  }

  return (
    <div>
      <CouponCode
        price={summary.preDiscount}
        user={userId}
        context="checkout"
        setCoupon={setCoupon}
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
        price={summary.total - (coupon?.discount || 0)}
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

export const useFetchCart = () => {
  const rootDispatch = useDispatch()

  return () => {
    rootDispatch(CartUtils.view()).then(() => rootDispatch(CartUtils.summary()))
  }
}

export const PaymentRequest = ({
  onCheckout,
  dispatch,
  children = null,
  couponCode,
  coupon,
  setVisible,
}) => {
  const stripe = useStripe()
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const [paymentRequest, setPaymentRequest] = React.useState(null)
  const [paymentIntent, setPaymentIntent] = React.useState(null)

  // Create/Update paymentintent
  React.useEffect(() => {
    const cleanedCouponCode = cleanField(couponCode)
    if (paymentIntent) {
      axios
        .put(`/orders/checkout/payment-intents/${paymentIntent.id}`, {
          couponCode: cleanedCouponCode,
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
          couponCode: cleanedCouponCode,
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
  }, [cart, coupon])

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

  React.useEffect(() => {
    if (paymentRequest && paymentIntent) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [paymentRequest, paymentIntent])

  if (paymentRequest && paymentIntent) {
    return (
      <PaymentRequestContainer
        couponCode={couponCode}
        paymentRequest={paymentRequest}
        setPaymentRequest={setPaymentRequest}
        paymentIntent={paymentIntent}
        onCheckout={onCheckout}
        dispatch={dispatch}
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
  onCheckout,
  dispatch,
  couponCode,
}) => {
  const stripe = useStripe()
  const summary = useSelector((state) => state.cart.checkoutSummary)
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
          return {
            address: {
              fullName: ev.shippingAddress.recipient,
              mobileNumber: ev.shippingAddress.phone,
              addressLine1: ev.shippingAddress.addressLine[0],
              addressLine2: ev.shippingAddress.addressLine[1],
              town: ev.shippingAddress.city,
              postcode: ev.shippingAddress.postalCode,
            },
            contact: {
              email: ev.payerEmail,
              fullName: ev.payerName,
              nickName: ev.payerName.split(' ')[0],
            },
          } as const
        }

        const checkout = () => {
          dispatch({ type: 'status-processing' })
          const info = toCheckout(ev)

          validatePostcode(info.address.postcode)
            .then(() =>
              axios.post('/orders/checkout-request', {
                contact: info.contact,
                address: info.address,
                couponCode: cleanField(couponCode),
                orders: cart.map((item) => item.order),
                paymentIntent: paymentIntent.id,
                paymentMethod: ev.paymentMethod.id,
              })
            )
            .then(() => onCheckout({ contact: info.contact }))
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
