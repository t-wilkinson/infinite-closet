import React from 'react'
import axios from 'axios'
import * as Stripe from '@stripe/react-stripe-js'

import { CartUtils } from '@/Cart/slice'
import { CouponCode, UseField, Coupon } from '@/Form'
import { validatePostcode } from '@/Form/Address'
import { fmtPrice } from '@/utils/helpers'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

export const Summary = ({
  userId = undefined,
  summary,
  couponCode,
  setCoupon,
  coupon,
}: {
  userId?: string
  summary: any
  couponCode: UseField<Coupon>
  setCoupon: (coupon: Coupon) => void
  coupon: Coupon
}) => {
  if (!summary) {
    return null
  }

  return (
    <div className="">
      <div className="w-full my-2">
        <CouponCode
          price={summary.preDiscount}
          user={userId}
          context="checkout"
          setCoupon={setCoupon}
          field={couponCode}
        />
      </div>
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

function handleServerResponse(
  response: {status: string; requires_action?: boolean; payment_intent_client_secret?: string; error?: string; body: object},
  stripe: any,
  form: UseField,
) {
  if (response.error) {
    // Show error from server on payment form
    form.setValue('error')
    form.setErrors('Unable to process payment')
  } else if (response.status === 'no-charge') {
    form.setValue('success')
    form.clearErrors()
  } else if (response.requires_action) {
    // Use Stripe.js to handle required card action
    stripe
      .handleCardAction(response.payment_intent_client_secret)
      .then((res: any) =>
        handleStripeJsResult(res, stripe, form, response.body)
      )
  } else {
    form.setValue('success')
    form.clearErrors()
  }
}

function handleStripeJsResult(
  result: {paymentIntent?: any; error?: string},
  stripe: any,
  form: UseField,
  body: object,
) {
  if (result.error) {
    form.setValue('success')
    form.setErrors(result.error)
  } else {
    // The card action has been handled
    // The PaymentIntent can be confirmed again on the server
    axios
      .post('/orders/checkout', {
        paymentIntent: result.paymentIntent.id,
        ...body,
      })
      .then((res) => handleServerResponse(res.data, stripe, form))
  }
}

export const useCheckoutSuccess = (form: UseField) => {
  const analytics = useAnalytics()
  const fetchCart = useFetchCart()
  const rootDispatch = useDispatch()

  return () => {
    rootDispatch(CartUtils.set([]))
    fetchCart()
    form.setValue('success')
    form.clearErrors()
    analytics.logEvent('purchase', {
      user: 'guest',
      type: 'checkout',
    })
  }
}

export const useCheckout = (form: UseField) => {
  const cart = useSelector((state) => state.cart.checkoutCart)
  const elements = Stripe.useElements()
  const stripe = Stripe.useStripe()
  const onCheckoutSuccess = useCheckoutSuccess(form)

  const checkout = async ({ address, billing, email, couponCode }) => {
    const contact = {
      email,
      fullName: address.fullName,
      nickName: address.fullName.split(' ')[0],
    }

    await validatePostcode(address.postcode)
      .then(() =>
        stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(Stripe.CardElement),
          billing_details: { name: billing.name, email },
        })
      )

      .then((res) => {
        if (res.error) {
          return Promise.reject(res.error)
        } else {
          return axios.post('/orders/checkout', {
            contact,
            address,
            paymentMethod: res.paymentMethod.id,
            orders: cart.map((item) => item.order),
            couponCode,
          })
        }
      })

      .then((res) => res.data)
      .then((res) => handleServerResponse(res, stripe, form))

      .then(onCheckoutSuccess)

      .catch(() => {
        throw 'We ran into an issue processing your payment. Please try again later.'
      })
    return { contact }
  }

  return checkout
}
