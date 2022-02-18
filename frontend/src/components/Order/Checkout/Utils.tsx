import React from 'react'
import * as Stripe from '@stripe/react-stripe-js'
import Image from 'next/image'

import axios from '@/utils/axios'
import { currency } from '@/utils/config'
import { fmtPrice } from '@/utils/helpers'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import { Summary, Contact } from '@/types'
import { StrapiCheckout } from '@/types/models'

import { productToItem } from '@/Order/utils'
import { CartItem, OrderUtils } from '@/Order'
import { DiscountCode, UseField } from '@/Form'
import { validatePostcode } from '@/Form/Address'
import { Hover } from '@/Components'

export const onPurchaseEvent = ({checkout, analytics, summary}) => {
  analytics.logEvent('purchase', {
    currency,
    transaction_id: checkout.purchase.id,
    value: summary.total,
    coupon: summary.coupon?.code,
    shipping: summary.shipping,
    items: checkout.orders.map((order, i) => {
      return {
        ...productToItem(order.product, order.rentalLength),
        currency,
        index: i,
      }
    }),
  })
}

export const toContact = ({ email, address }: Contact) => {
  const names = address.fullName.split(' ')
  return {
    email,
    firstName: names[0],
    lastName: names.slice(1).join(' ').trim(),
    fullName: address.fullName.trim(),
    nickName: names[0],
  }
}

export const CheckoutSummary = ({
  userId = undefined,
  summary,
  discountCode,
  accurateSummary, // Represents rate-limited summary
  setAccurateSummary,
}: {
  userId?: string
  summary: any
  discountCode: UseField<string>
  accurateSummary: Summary
  setAccurateSummary: (summary: Summary) => void
}) => {
  if (!summary) {
    return null
  }
  const discount = summary.discount + (accurateSummary?.discount || 0)

  return (
    <article className="flex flex-col">
      <Price label="Subtotal" price={summary.subtotal} />
      <Price label="Insurance" price={summary.insurance}>
        <InsuranceInfo position="left-0" className="mr-2" />
      </Price>

      <Price label="Shipping" price={summary.shipping} />
      <div className="w-full my-2">
        <DiscountCode
          price={summary.preDiscount}
          user={userId}
          context="checkout"
          setSummary={setAccurateSummary}
          discountCode={discountCode}
        />
      </div>
      {discount > 0 && <Price negative label="Discount" price={discount} />}
      <div className="h-px bg-pri my-1 mt-3" />
      <Price
        label="Total"
        price={summary.total - (accurateSummary?.discount || 0)}
        className="font-bold"
      />
    </article>
  )
}

const Price = ({
  negative = false,
  label,
  price,
  className = '',
  children = null,
}) => (
  <div className={`flex-row justify-between ${className}`}>
    <div className="flex-row items-center">
      {label}
      {children}
    </div>
    <span>
      {negative && '-'} {fmtPrice(price)}
    </span>
  </div>
)

export const InsuranceInfo = (props) => (
  <Hover {...props}>
    We offer damage protection with every item, which renters can opt in to
    purchase for £5 per order. Damage protection covers the cost of the repair
    (i.e.—stain removal, broken zippers, missing beading), up to a max of £50*.
    <br />
    <br />
    <small className="text-xs">
      *This does not cover: Damage beyond repair, theft, loss of item, or
      damages beyond the £50 repair fee
    </small>
  </Hover>
)

export const PaymentSubText = () => (
  <div className="space-y-1">
    <strong>FREE 2-day Shipping & Returns</strong>
    <div className="relative inline-block w-64 h-8">
      <Image
        layout="fill"
        objectFit="contain"
        src="/icons/payment-methods-secure.png"
      />
    </div>
  </div>
)

export const useFetchCart = () => {
  const dispatch = useDispatch()

  return async () => {
    dispatch(OrderUtils.favorites())
    await dispatch(OrderUtils.view())
    dispatch(OrderUtils.summary())
  }
}

export const useGuestCheckout = () => {
  const cart = useSelector((state) => state.orders.checkoutCart)
  const elements = Stripe.useElements()
  const stripe = Stripe.useStripe()
  const analytics = useAnalytics()
  const fetchCart = useFetchCart()
  const rootDispatch = useDispatch()

  const checkout = async ({ summary, form, address, billing, email, discountCode }) => {
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
              discountCode,
            },
            { withCredentials: false }
          )
        }
      })

      .then((res) => handleServerResponse(res, stripe, form))

      .then(({checkout}) => {
        rootDispatch(OrderUtils.set([]))
        fetchCart()
        onPurchaseEvent({
          checkout,
          analytics,
          summary,
        })
      })

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

export function handleServerResponse(
  response: {
    status: string
    requires_action?: boolean
    payment_intent_client_secret?: string
    error?: string
    body: object
    checkout?: StrapiCheckout
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
    return { checkout: response.checkout }
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
    return { checkout: response.checkout }
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

export const isOrderInvalid = (order: CartItem) => !order.valid
