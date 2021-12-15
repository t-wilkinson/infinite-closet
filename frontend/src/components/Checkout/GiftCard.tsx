import React from 'react'

import { Form, Input, Submit, Money, useFields } from '@/Form'
import { PaymentWrapper, PaymentCard } from '@/Form/Payment'

interface GiftCardFields {
  amount: number
  billingName: string
}

export const GiftCard = () => {
  const fields = useFields<GiftCardFields>({
    amount: { },
    billingName: { constraints: 'required' },
  })

  const onSubmit = () => {
  }

  return <PaymentWrapper>
    <Form onSubmit={onSubmit} fields={fields}>
      <Money field={fields.get('amount')} />
      <Input field={fields.get('billingName')} />
      <PaymentCard form={fields.form} />
      <Submit form={fields.form} />
    </Form>
  </PaymentWrapper>
}

export default GiftCard
