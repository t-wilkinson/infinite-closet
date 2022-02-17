import React from 'react'
import { useRouter } from 'next/router'
import { useStripe } from '@stripe/react-stripe-js'

import { fmtPrice } from '@/utils/helpers'
import Layout from '@/Layout'
import { Form, Submit, useFields, BodyWrapper } from '@/Form'
import {
  PaymentWrapper,
  PaymentElement,
  usePaymentElement,
} from '@/Form/Payment'

export const Page = () => {
  const router = useRouter()
  const { payment_intent_client_secret: clientSecret } = router.query

  if (!clientSecret) {
    return null
  }

  return (
    <Layout>
      <PaymentWrapper clientSecret={clientSecret}>
        <ConfirmPayment clientSecret={clientSecret} />
      </PaymentWrapper>
      <div className="h-8" />
    </Layout>
  )
}

const ConfirmPayment = ({clientSecret}) => {
  const fields = useFields<{
    paymentStatus: any
  }>({
    paymentStatus: { default: null },
  })
  const payment = usePaymentElement({
    fields,
  })
  const [paymentIntent, setPaymentIntent] = React.useState()
  const stripe = useStripe()

  const onSubmit = React.useCallback(async () => {
    await payment.handleSubmit({})
  }, [fields.status])

  React.useEffect(() => {
    payment.on('success', () => {})
  }, [])

  React.useEffect(() => {
    if (stripe) {
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => setPaymentIntent(paymentIntent))
    }
  }, [stripe])

  console.log('paymentIntent', paymentIntent)
  if (fields.status === 'success' || paymentIntent?.status === 'succeeded') {
    return <BodyWrapper label={`Thank you for your purchase`} />
  }

  const paymentStatus = fields.value('paymentStatus')
  console.log('paymentStatus', paymentStatus)
  if (paymentStatus?.type === 'requires_action') {
    return (
      <div>
        <iframe src={paymentStatus.url} width={600} height={400} />
      </div>
    )
  }

  return (
    <Form fields={fields} onSubmit={onSubmit}>
      <PaymentElement id="payment-element" />
      <Submit form={fields.form}>
        Pay {paymentIntent && fmtPrice(paymentIntent.amount / 100)}
      </Submit>
    </Form>
  )
}

export default Page
