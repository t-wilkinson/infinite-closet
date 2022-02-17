import React from 'react'
import { useRouter } from 'next/router'

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
        <ConfirmPayment />
      </PaymentWrapper>
      <div className="h-8" />
    </Layout>
  )
}

const ConfirmPayment = () => {
  const fields = useFields<{
    paymentStatus: any
  }>({
    paymentStatus: { default: null },
  })
  const payment = usePaymentElement({
    fields,
  })

  const onSubmit = React.useCallback(async () => {
    await payment.handleSubmit({})
  }, [fields.status])

  React.useEffect(() => {
    payment.on('success', () => {})
  }, [])

  if (fields.status === 'success') {
    return <BodyWrapper label={`Thank you for your purchase`} />
  }

  const paymentStatus = fields.value('paymentStatus')
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
      <Submit form={fields.form} />
    </Form>
  )
}

export default Page
