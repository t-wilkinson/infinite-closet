import React from 'react'
import { useStripe } from '@stripe/react-stripe-js'

import axios from '@/utils/axios'
import { Summary } from '@/types'
import { validatePostcode } from '@/Form/Address'
import { useSelector } from '@/utils/store'
import { UseFormField } from '@/Form'
import { CartItem } from '@/Cart/types'

import { Contact } from './Utils'

export const PaymentRequestForm = ({
  form,
  discountCode,
  onCheckout,
  children = null,
  accurateSummary,
  setVisible,
}: {
  discountCode: string
  form: UseFormField
  children?: React.ReactElement
  onCheckout: () => void
  accurateSummary: Summary
  setVisible: (visible: boolean) => void
}) => {
  const stripe = useStripe()
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const [paymentRequest, setPaymentRequest] = React.useState(null)
  const [paymentIntent, setPaymentIntent] = React.useState(null)

  // Create/Update paymentintent
  React.useEffect(() => {
    if (cart.length === 0) {
      setPaymentIntent(null)
      return
    }

    if (paymentIntent) {
      axios
        .put(`/orders/checkout/payment-intents/${paymentIntent.id}`, {
          discountCode,
          orders: cart.map((item) => item.order),
        })
        .then((data) => {
          if (data?.error) {
            throw data.error
          } else {
            setPaymentIntent(data)
          }
        })
        .catch(() => setPaymentIntent(null))
    } else {
      axios
        .post('/orders/checkout/payment-intents', {
          discountCode,
          orders: cart.map((item) => item.order),
        })
        .then((data) => {
          if (data?.error) {
            throw data.error
          } else {
            setPaymentIntent(data)
          }
        })
        .catch(() => setPaymentIntent(null))
    }
  }, [cart, accurateSummary])

  // Create paymentRequest
  React.useEffect(() => {
    if (!stripe || !accurateSummary) return
    const pr = stripe.paymentRequest({
      country: 'GB',
      currency: 'gbp',
      total: {
        label: 'Checkout total',
        amount: accurateSummary.amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: true,
      shippingOptions: [
        {
          id: 'default-shipping',
          label: 'Zero Emission Delivery',
          detail: 'Carbon-neutral shipping by Royal Mail',
          amount: 0,
        },
        // {
        //   id: 'default-shipping',
        //   label: 'Zero Emission Delivery',
        //   detail: 'Carbon-neutral shipping by Hived',
        //   amount: Math.round(summary.shipping * 100),
        // },
      ],
    })

    // Check the availability of the Payment Request API.
    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr)
      }
    })
  }, [stripe, accurateSummary])

  React.useEffect(() => {
    if (paymentRequest) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [paymentRequest])

  if (paymentRequest) {
    return (
      <PaymentRequestContainer
        discountCode={discountCode}
        paymentRequest={paymentRequest}
        setPaymentRequest={setPaymentRequest}
        paymentIntent={paymentIntent}
        onCheckout={onCheckout}
        form={form}
      />
    )
  }

  // Use a traditional checkout form.
  return children
}

const PaymentRequestContainer = ({
  form,
  discountCode,
  paymentRequest,
  setPaymentRequest,
  paymentIntent,
  onCheckout,
}: {
  form: UseFormField
  discountCode: string
  paymentRequest: any
  paymentIntent: any
  setPaymentRequest: (paymentRequest: any) => void
  onCheckout: (_: { contact: Contact }) => void
}) => {
  const stripe = useStripe()
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const cart = useSelector((state) => state.cart.checkoutCart)

  React.useEffect(() => {
    paymentRequest.on('paymentmethod', async (ev: any) => {
      if (form.value === 'submitting') {
        return
      }
      form.clearErrors()
      form.setValue('submitting')

      onPaymentMethod({
        cart,
        clientSecret: paymentIntent?.client_secret,
        discountCode,
        ev,
        onCheckout,
        setPaymentRequest,
        stripe,
      })
        .then(() => {
          form.setValue('success')
          form.setErrors()
        })
        .catch((err) => {
          form.setValue('error')
          form.setErrors(err.message || err || 'Error processing payment')
        })
    })

    paymentRequest.on('shippingaddresschange', async function (ev: any) {
      if (
        process.env.NODE_ENV === 'test' ||
        process.env.NODE_ENV === 'production'
      ) {
        return axios
          .get(`/addresses/verify/${ev.shippingAddress.postalCode}`, {
            withCredentials: false,
          })
          .then((data) => {
            if (data.valid) {
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
    <PaymentRequestButton paymentRequest={paymentRequest} stripe={stripe} />
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

const paymentRequestCheckout = async ({ev, discountCode, cart, paymentIntent, onCheckout}: {
  ev: any
  discountCode: string
  cart: CartItem[]
  paymentIntent?: any
  onCheckout: (_: any) => void
}) => {
  const info = {
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
      nickName: ev.payerName.split(' ')[0] || undefined,
    },
  }

  return validatePostcode(info.address.postcode)
    .then(() =>
      axios.post<void>('/orders/checkout-request', {
        contact: info.contact,
        address: info.address,
        discountCode,
        orders: cart.map((item: CartItem) => item.order),
        paymentIntent: paymentIntent?.id,
        paymentMethod: ev.paymentMethod.id,
      })
    )
    .then(() => onCheckout({ contact: info.contact }))
}

const onPaymentMethod = async ({
  cart,
  clientSecret,
  discountCode,
  ev,
  onCheckout,
  setPaymentRequest,
  stripe,
}) => {
  if (!clientSecret) {
    await paymentRequestCheckout({ev, discountCode, cart, onCheckout})
    return
  }

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
    throw confirmError
  }

  // Report to the browser that the confirmation was successful, prompting
  // it to close the browser payment method collection interface.
  ev.complete('success')
  // Check if the PaymentIntent requires any actions and if so let Stripe.js
  // handle the flow. If using an API version older than "2019-02-11"
  // instead check for: `paymentIntent.status === "requires_source_action"`.

  if (paymentIntent.status === 'requires_action') {
    // Let Stripe.js handle the rest of the payment flow.
    const { error } = await stripe.confirmCardPayment(clientSecret)
    if (error) {
      // The payment failed -- ask your customer for a new payment method.
      setPaymentRequest(null)
      throw error
    } else {
      // The payment has succeeded.
      await paymentRequestCheckout({ev, discountCode, cart, paymentIntent, onCheckout})
    }
  } else {
    // The payment has succeeded.
    await paymentRequestCheckout({ev, discountCode, cart, paymentIntent, onCheckout})
  }
}

export default PaymentRequestForm
