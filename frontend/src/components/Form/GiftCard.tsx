import React from 'react'
import { Elements, PaymentElement, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

import axios from '@/utils/axios'
import {
  Form,
  Submit,
  Fieldset,
  MoneyAmounts,
  UseFields,
  BodyWrapper,
  useFields,
} from '@/Form'
import { CopyToClipboard } from '@/components'
import { StrapiGiftCard } from '@/types/models'
import { usePaymentElement } from './Payment'

interface GiftCardFields {
  value: number
}

const values = [10, 25, 50]

export const useGiftCardFields = () =>
  useFields<GiftCardFields>({
    value: { constraints: 'min:0 number', default: values[0] },
  })

const GiftCardContent = ({ fields }: { fields: UseFields<GiftCardFields> }) => {
  const payment = usePaymentElement({
    form: fields.form,
  })
  const [giftcard, setGiftcard] = React.useState<StrapiGiftCard>(null)
  const stripe = useStripe()

  const onSubmit = () => {
    payment.onSubmit()
  }

  React.useEffect(() => {
    if (fields.status !== 'success' || !stripe) {
      return
    }

    const paymentIntent = new URLSearchParams(window.location.search).get(
      'payment_intent'
    )

    if (!paymentIntent) {
      return
    }

    axios
      .post('/giftcards', {
        paymentIntent,
      })
      .then((giftcard) => {
        setGiftcard(giftcard)
      })
  }, [fields.status, stripe])

  if (fields.status === 'success' && giftcard) {
    return (
      <BodyWrapper label={`Successfully purchased £${giftcard.value} gift card.`}>
        <span>
          Click to save the code
          <CopyToClipboard value={giftcard.code} message="gift card code" />.
        </span>
      </BodyWrapper>
    )
  }

  return (
    <Form onSubmit={onSubmit} fields={fields} className="w-full">
      <Fieldset label="Amount">
        <MoneyAmounts field={fields.get('value')} amounts={values} />
      </Fieldset>
      <Fieldset label="Billing">
        <PaymentElement id="payment-element" />
      </Fieldset>
      <div className="flex-row w-full space-x-2">
        <Submit className="w-full" form={fields.form} disabled={fields.form.value === 'success'} />
        {/* <Submit className="w-full" form={fields.form} disabled={fields.form.value === 'success'}> */}
        {/*   Send as a gift */}
        {/* </Submit> */}
      </div>
    </Form>
  )
}

export const GiftCard = ({ paymentIntent: paymentIntent_, fields }) => {
  const clientSecret: string = paymentIntent_?.client_secret
  const [paymentIntent, setPaymentIntent] = React.useState(paymentIntent_)

  React.useEffect(() => {
    const value = fields.value('value')
    if (isNaN(value) || value <= 0) {
      return
    }

    axios
      .put(
        `/giftcards/payment-intent/${paymentIntent.id}`,
        {
          value,
        },
        { withCredentials: false }
      )
      .then((paymentIntent: any) => {
        setPaymentIntent(paymentIntent)
      })
      .catch(() => {
        fields.setStatus('error')
        fields.setError('An unexpected error occured.')
      })
  }, [fields.value('value')])

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      fonts: ['Lato'],
      variables: {
        colorPrimary: '#ad9253',
        colorText: '#000000',
        borderRadius: '0.125rem',
        borderColor: '#5f6368',
      },
    },
  } as any

  return (
    <Elements stripe={promise} options={options}>
      <GiftCardContent fields={fields} />
    </Elements>
  )
}
