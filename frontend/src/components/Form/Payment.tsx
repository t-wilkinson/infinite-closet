import React from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import axios from '@/utils/axios'
import { Warning, Input, useFields, Submit, Form } from '@/Form'
import { Icon, iconClose, iconCheck } from '@/Icons'
import { useSignin } from '@/User'
import { BlueLink } from '@/components'
import { StrapiUser } from '@/types/models'
import useAnalytics from '@/utils/useAnalytics'

export * from './PaymentWrapper'
// import './CheckoutForm.module.css'

const toTitleCase = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const PaymentMethods = ({ user, state, dispatch }) => {
  return (
    <div className="space-y-4">
      {state.paymentMethods.map((paymentMethod: any) => (
        <PaymentMethod
          key={paymentMethod.id}
          state={state}
          dispatch={dispatch}
          userId={user.id}
          {...paymentMethod}
        />
      ))}
    </div>
  )
}

export const PaymentMethod = ({
  id,
  dispatch,
  state,
  card: { brand, exp_month, exp_year, last4 },
  userId,
}) => {
  const signin = useSignin()

  const removePaymentMethod = () => {
    axios
      .delete<void>(`/account/${userId}/payment-methods/${id}`)
      .then(() => signin())
      .catch((err) => console.error(err))
  }

  return (
    <div className="relative">
      <button
        type="button"
        className={`relative flex border bg-gray-light p-4 flex-row cursor-pointer items-center
      ${id === state.paymentMethod ? 'border-black' : ''}
      `}
        aria-label={`Choose ${toTitleCase(brand)}
      card ending in ${last4} which expires on ${exp_month}/${exp_year}
      `}
        onClick={() => dispatch({ type: 'choose-payment-method', payload: id })}
      >
        <div className="mr-4 w-4 h-4 rounded-full border border-gray items-center justify-center mr-2">
          <div
            className={`w-3 h-3 rounded-full
          ${id === state.paymentMethod ? 'bg-pri' : ''}
          `}
          />
        </div>
        <div className="items-start justify-between">
          <span>
            {toTitleCase(brand)} ending in {last4}
          </span>
          <span>
            Expires {exp_month}/{exp_year}
          </span>
        </div>
      </button>
      <button
        className="absolute top-0 right-0 p-2"
        type="button"
        onClick={removePaymentMethod}
      >
        <Icon icon={iconClose} size={16} />
      </button>
    </div>
  )
}

export const cardStyle = {
  style: {
    base: {
      color: 'black',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#666',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

type AddPaymentMethod = {
  user: StrapiUser
  state: any
  dispatch: any
}

export const AddPaymentMethod = ({ user, state, dispatch }) => (
  <AddPaymentMethodFormWrapper user={user} state={state} dispatch={dispatch} />
)

export const AddPaymentMethodFormWrapper = ({ user, state, dispatch }) => {
  const onSubmit = (setupIntent: any) => {
    dispatch({ type: 'close-popup' })
    dispatch({
      type: 'choose-payment-method',
      payload: setupIntent.payment_method,
    })

    axios.get('/account/payment-methods')
      .then((paymentMethods) => {
        dispatch({
          type: 'set-payment-methods',
          payload: paymentMethods,
        })
      })
      .catch((err) => console.error(err))
  }

  const onClose = () => {
    dispatch({ type: 'close-popup' })
  }

  if (state.popup !== 'payment') {
    return <div />
  }

  return (
    <AddPaymentMethodForm user={user} onSubmit={onSubmit} onClose={onClose} />
  )
}

const AddPaymentMethodHeader = ({ onClose }) => (
  <>
    <div className="w-full items-center">
      <span className="font-bold text-3xl mt-2">Add Payment Method</span>
    </div>

    <div className="w-full h-px bg-pri mb-6 mt-1 rounded-full" />

    <button className="absolute top-0 right-0 m-3" onClick={onClose}>
      <Icon icon={iconClose} size={20} />
    </button>
  </>
)

export const Authorize = ({ field }) => (
  <button
    onClick={() => field.setValue(!field.value)}
    aria-label="Authorize Infinite Closet to handle card details"
    type="button"
    className="flex flex-col"
  >
    <div className="flex flex-row items-center">
      <div className="items-center justify-center w-5 h-5 bg-white border border-black rounded-sm mr-4">
        {field.value && <Icon icon={iconCheck} className="w-3 h-3" />}
      </div>
      <span className="w-full text-left">
        I authorise Infinite Closet to send instructions to the financial
        institution that issued my card to take payments from my card account in
        accordance with the{' '}
        <BlueLink href="/terms-and-conditions" label="terms and conditions" />.
      </span>
    </div>
    <Warning warnings={field.errors} />
  </button>
)

export const AddPaymentMethodForm = ({ user, onSubmit, onClose }) => {
  const [succeeded, setSucceeded] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)
  const [disabled, setDisabled] = React.useState(true)
  const [clientSecret, setClientSecret] = React.useState('')
  const stripe = useStripe()
  const elements = useElements()
  const analytics = useAnalytics()

  const fields = useFields<{
    authorized: boolean
    billingName: string
  }>({
    authorized: {
      constraints: 'selected',
      default: false,
      errorMessage: 'Please authorise us to use this payment method',
    },
    billingName: {
      label: 'Billing Name',
      constraints: 'required',
      default: `${user.firstName || ''} ${user.lastName || ''}`,
    },
  })

  React.useEffect(() => {
    if (user) {
      axios
        .post<{clientSecret: string}>('/account/wallet', {})
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => console.error(err))
    }
  }, [user])

  const handleChange = async (event: any) => {
    setDisabled(event.empty)
    fields.form.setErrors(event.error ? event.error.message : '')
  }

  const addPaymentMethod = async (e: React.SyntheticEvent) => {
    const cleaned = fields.clean()
    e.preventDefault()
    setProcessing(true)
    const payload = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: cleaned.billingName || undefined,
          email: user.email || undefined,
          phone: user.phoneNumber || undefined,
        },
      },
    })

    if (payload.error) {
      setProcessing(false)
      throw `Payment failed ${payload.error.message}`
    } else {
      setProcessing(false)
      setSucceeded(true)
      analytics.logEvent('add_payment_info', {
        user: user.email,
      })
      onSubmit(payload.setupIntent)
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-50 items-center justify-center">
      <Form
        id="payment-form"
        fields={fields}
        className="w-full max-w-sm w-full p-6 bg-white rounded-lg relative"
        onSubmit={addPaymentMethod}
      >
        <AddPaymentMethodHeader onClose={onClose} />

        <Input field={fields.get('billingName')} />
        <div className="my-4 border border-gray rounded-sm p-4">
          <CardElement
            id="card-element"
            options={cardStyle}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <Authorize field={fields.get('authorized')} />
        </div>

        <Submit
          className="w-full"
          field={fields.form}
          disabled={processing || disabled || succeeded}
        >
          Submit
        </Submit>
      </Form>
    </div>
  )
}
