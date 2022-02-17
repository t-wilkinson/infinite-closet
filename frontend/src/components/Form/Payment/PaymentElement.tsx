import React from 'react'
import { useRouter } from 'next/router'
import { useStripe, useElements } from '@stripe/react-stripe-js'

import { UseFields } from '@/Form'
import { useFieldEventTarget, FieldEvent } from '@/Form/Events'

export { PaymentElement } from '@stripe/react-stripe-js'

type PaymentElementEvents = 'success'

const updateFormStatus = (fields, paymentIntent) => {
  switch (paymentIntent.status) {
    case 'succeeded':
      fields.form.setValue('success')
      break
    case 'processing':
      fields.form.setValue('submitting')
      break
    case 'requires_payment_method':
      fields.form.setValue('error')
      fields.form.setError('Payment failed. Please try another payment method.')
      break
    case 'requires_action':
      fields.form.setValue('error')
      fields.setValue('paymentStatus', {
        type: 'requires_action',
        url: paymentIntent.next_action.redirect_to_url.url,
      })
      break
    default:
      fields.form.setValue('error')
      fields.form.setError('Something went wrong.')
      break
  }
}

export const usePaymentElement = ({ fields }: { fields: UseFields }) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const target = useFieldEventTarget({ singleListener: true })

  const handleSubmit = React.useCallback(
    async ({ formData = {} }) => {
      if (!stripe || !elements) {
        throw 'Please fill out the form.'
      }

      const params = new URLSearchParams(formData)
      // @ts-ignore
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/buy/complete?${params.toString()}`,
          // redirect: 'if_required',
        },
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          throw error.message
        } else {
          throw 'An unexpected error occured.'
        }
      }
    },
    [stripe, elements]
  )

  // Check status of payment through client_secret in query params
  React.useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      updateFormStatus(fields, paymentIntent)
    })
  }, [stripe])

  // Success event
  React.useEffect(() => {
    const query = router.query
    const paymentIntent = query.payment_intent

    if (!paymentIntent || !stripe || fields.form.value !== 'success') {
      return
    }

    const successEvent = new FieldEvent('success', {
      paymentIntent,
      ...query,
    })

    target.dispatch(successEvent)
  }, [target, fields.form.value, stripe])

  return {
    handleSubmit,
    on: (event: PaymentElementEvents, cb: (_: any) => void) => {
      switch (event) {
        case 'success':
          target.on(event, (e: FieldEvent) => {
            cb(e.data)
          })
          break
      }
    },
  }
}
