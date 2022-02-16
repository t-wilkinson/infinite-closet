import React from 'react'
import { useRouter } from 'next/router'
import { useStripe, useElements } from '@stripe/react-stripe-js'

import { UseFormField, } from '@/Form'
import { useFieldEventTarget, FieldEvent } from '@/Form/Events'

type PaymentElementEvents = 'success'

export const usePaymentElement = ({ form }: { form: UseFormField }) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const target = useFieldEventTarget({ singleListener: true })

  const handleSubmit = React.useCallback(async ({ formData }) => {
    if (!stripe || !elements) {
      throw 'Please fill out the form.'
    }

    const params = new URLSearchParams(formData)
    // @ts-ignore
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.href}?${params.toString()}`,
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
  }, [stripe, elements])

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
      switch (paymentIntent.status) {
        case 'succeeded':
          form.setValue('success')
          break
        case 'processing':
          form.setValue('submitting')
          break
        case 'requires_payment_method':
          form.setValue('error')
          form.setError('Your payment was not successful, please try again.')
          break
        default:
          form.setValue('error')
          form.setError('Something went wrong.')
          break
      }
    })
  }, [stripe])

  // Success event
  React.useEffect(() => {
    if (form.value !== 'success' || !stripe) {
      return
    }

    const query = router.query
    const paymentIntent = query.payment_intent

    if (!paymentIntent) {
      return
    }

    const successEvent = new FieldEvent('success', {
      paymentIntent,
      ...query,
    })
    target.dispatch(successEvent)
  }, [target, form.value, stripe])

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


