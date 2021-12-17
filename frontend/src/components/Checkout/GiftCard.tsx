import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe } from '@stripe/react-stripe-js'
const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
import { toast } from 'react-toastify'

import axios from '@/utils/axios'
import {
  Form,
  Submit,
  Fieldset,
  MoneyAmounts,
  useFields,
  UseFields,
  BodyWrapper,
} from '@/Form'
import { usePaymentElement } from '@/Form/Payment'
import { StrapiGiftCard } from '@/types/models'

interface GiftCardFields {
  amount: number
}

const amounts = [10, 25, 50]

export const GiftCardWrapper = ({ data }) => {
  const clientSecret: string = data.paymentIntent?.client_secret
  const [paymentIntent, setPaymentIntent] = React.useState(data.paymentIntent)
  const fields = useFields<GiftCardFields>({
    amount: { constraints: 'min:0 number', default: amounts[0] },
  })

  React.useEffect(() => {
    const amount = fields.value('amount')
    if (isNaN(amount) || amount <= 0) {
      return
    }

    axios
      .put(
        `/giftcards/payment-intent/${paymentIntent.id}`,
        {
          amount,
        },
        { withCredentials: false }
      )
      .then((paymentIntent) => {
        setPaymentIntent(paymentIntent)
      })
      .catch(() => {
        fields.setStatus('error')
        fields.setError('An unexpected error occured.')
      })
  }, [fields.fields.amount.value])

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
      <GiftCard fields={fields} />
    </Elements>
  )
}

const GiftCard = ({ fields }: { fields: UseFields<GiftCardFields> }) => {
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
    const code = giftcard.code.slice(0, 6)

    return (
      <BodyWrapper label="Successfully purchased gift card">
        Purchased gift card for ${giftcard.amount}.
        <span>
          Please save the code
          <button
            type="button"
            className="bg-gray-light p-2 rounded-m m-2 select-all"
            onClick={() => {
              navigator.clipboard?.writeText(code).then(
                () => toast.success('Successfully copied gift card code to clipboard.'),
                () => toast.error('Could not copy gift card code to clipboard.')
              )
            }}
          >
            {code}
          </button>
          .
        </span>
      </BodyWrapper>
    )
  }

  return (
    <Form onSubmit={onSubmit} fields={fields}>
      <Fieldset label="Amount">
        <MoneyAmounts field={fields.get('amount')} amounts={amounts} />
      </Fieldset>
      <Fieldset label="Billing">
        <PaymentElement id="payment-element" />
      </Fieldset>
      <Submit form={fields.form} disabled={fields.form.value === 'success'} />
    </Form>
  )
}

export default GiftCardWrapper
