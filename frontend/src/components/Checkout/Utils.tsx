import React from 'react'
import * as Stripe from '@stripe/react-stripe-js'

import { CartUtils } from '@/Cart/slice'
import { CartItem } from '@/Cart/types'
import { CouponCode, UseField, Coupon } from '@/Form'
import { validatePostcode } from '@/Form/Address'
import axios from '@/utils/axios'
import { fmtPrice } from '@/utils/helpers'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

export interface Contact {
  email: string
  address: { fullName: string; nickName?: string }
}

export const toContact = ({ email, address }: Contact) => ({
  email,
  fullName: address.fullName,
  nickName: address.fullName.split(' ')[0],
})

export const Summary = ({
  userId = undefined,
  summary,
  couponCode,
  setCoupon,
  coupon,
}: {
  userId?: string
  summary: any
  setCoupon: (coupon: Coupon) => void
  coupon: Coupon
  couponCode: UseField<string>
}) => {
  if (!summary) {
    return null
  }

  return (
    <article className="flex flex-col">
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
    </article>
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
  response: {
    status: string
    requires_action?: boolean
    payment_intent_client_secret?: string
    error?: string
    body: object
  },
  stripe: any,
  form: UseField
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
  result: { paymentIntent?: any; error?: string },
  stripe: any,
  form: UseField,
  body: object
) {
  if (result.error) {
    form.setValue('success')
    form.setErrors(result.error)
  } else {
    // The card action has been handled
    // The PaymentIntent can be confirmed again on the server
    axios
      .post(
        '/orders/checkout',
        {
          paymentIntent: result.paymentIntent.id,
          ...body,
        },
        { withCredentials: false }
      )
      .then((data) => handleServerResponse(data, stripe, form))
  }
}

const useGuestCheckoutSuccess = () => {
  const analytics = useAnalytics()
  const fetchCart = useFetchCart()
  const rootDispatch = useDispatch()

  return () => {
    rootDispatch(CartUtils.set([]))
    fetchCart()
    analytics.logEvent('purchase', {
      user: 'guest',
      type: 'checkout',
    })
  }
}

export const useGuestCheckout = () => {
  const cart = useSelector((state) => state.cart.checkoutCart)
  const elements = Stripe.useElements()
  const stripe = Stripe.useStripe()
  const onCheckoutSuccess = useGuestCheckoutSuccess()

  const checkout = async ({ form, address, billing, email, couponCode }) => {
    const contact = toContact({ email, address })
    return validatePostcode(address.postcode)
      .then(() =>
        stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(Stripe.CardElement),
          billing_details: { name: billing.name, email },
        })
      )

      .then((res) => {
        if (res.error) {
          throw res.error
        } else {
          return axios.post(
            '/orders/checkout',
            {
              contact,
              address,
              paymentMethod: res.paymentMethod.id,
              orders: cart.map((item) => item.order),
              couponCode,
            },
            { withCredentials: false }
          )
        }
      })

      .then((res) => handleServerResponse(res, stripe, form))
      .then(onCheckoutSuccess)
      .catch((error) => {
        if (error.message) {
          throw error
        } else {
          throw new Error(
            'We ran into an issue processing your payment. Please try again later.'
          )
        }
      })
  }

  return checkout
}

export const BodyWrapper = ({ children }) => (
  <section className="w-full items-center h-full justify-start bg-white rounded-sm pt-32 pb-16">
    <h3 className="font-bold text-xl flex flex-col items-center">{children}</h3>
  </section>
)

export const isOrderInvalid = (order: CartItem) => !order.valid
