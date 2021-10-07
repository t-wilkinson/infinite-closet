import React from 'react'
import axios from 'axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import { StrapiUser } from '@/utils/models'
import { fetchAPI } from '@/utils/api'
import { Button, Icon } from '@/components'
import { PaymentWrapper } from '@/Form/Payments'
import { useSignin } from '@/User'
import useAnalytics from '@/utils/useAnalytics'
import { useFields, cleanFields } from '@/Form/useFields'
import { Input } from '@/Form'

import './CheckoutForm.module.css'
import { iconClose, iconCheck } from '@/components/Icons'

const toTitleCase = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const PaymentMethods = ({ user, state, dispatch }) => {
  return (
    <div className="space-y-4">
      {state.paymentMethods.map((paymentMethod) => (
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
      .delete(`/account/${userId}/payment-methods/${id}`, {
        withCredentials: true,
      })
      .then(() => signin())
      .catch((err) => console.error(err))
  }

  return (
    <div className="relative">
      <button
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
  <PaymentWrapper>
    <AddPaymentMethodFormWrapper
      user={user}
      state={state}
      dispatch={dispatch}
    />
  </PaymentWrapper>
)

export const AddPaymentMethodFormWrapper = ({ user, state, dispatch }) => {
  const onSubmit = (setupIntent: any) => {
    dispatch({ type: 'close-popup' })
    dispatch({
      type: 'choose-payment-method',
      payload: setupIntent.payment_method,
    })

    fetchAPI('/account/payment-methods')
      .then((res) => {
        dispatch({
          type: 'set-payment-methods',
          payload: res.paymentMethods,
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

export const Authorise = ({ setAuthorisation, authorised }) => (
  <button
    onClick={() => setAuthorisation(!authorised)}
    aria-label="Authorize Infinite Closet to handle card details"
  >
    <div className="flex-row items-center">
      <div className="items-center justify-center w-5 h-5 bg-white border border-black rounded-sm mr-4">
        {authorised && <Icon icon={iconCheck} className="w-3 h-3" />}
      </div>
      <span className="w-full text-left">
        I authorise Infinite Closet to send instructions to the financial
        institution that issued my card to take payments from my card account in
        accordance with the terms of my agreement with you.
      </span>
    </div>
  </button>
)

export const AddPaymentMethodForm = ({ user, onSubmit, onClose }) => {
  const [succeeded, setSucceeded] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [processing, setProcessing] = React.useState(false)
  const [disabled, setDisabled] = React.useState(true)
  const [clientSecret, setClientSecret] = React.useState('')
  const [authorised, setAuthorisation] = React.useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const analytics = useAnalytics()
  const fields = useFields({
    name: {
      label: 'Billing Name',
      constraints: 'required',
      default: `${user.firstName} ${user.lastName}`,
    },
  })

  React.useEffect(() => {
    if (user) {
      axios
        .post('/account/wallet', {}, { withCredentials: true })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.error(err))
    }
  }, [user])

  const handleChange = async (event) => {
    setDisabled(event.empty)
    setError(event.error ? event.error.message : '')
  }

  const addPaymentMethod = async (e) => {
    const cleaned = cleanFields(fields)
    e.preventDefault()
    setProcessing(true)
    const payload = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: cleaned.name,
          email: user.email,
          phone: user.phoneNumber,
        },
      },
    })

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`)
      setProcessing(false)
    } else {
      setError(null)
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
      <form
        id="payment-form"
        className="w-full max-w-sm w-full p-6 bg-white rounded-lg relative"
        onSubmit={(e) => e.preventDefault()}
      >
        <AddPaymentMethodHeader onClose={onClose} />

        <Input {...fields.name} />
        <div className="my-8 border border-gray rounded-sm p-4">
          <CardElement
            id="card-element"
            options={cardStyle}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <Authorise
            setAuthorisation={setAuthorisation}
            authorised={authorised}
          />
        </div>

        <div className="w-full items-center">
          <Button
            className="w-full"
            disabled={processing || disabled || succeeded || !authorised}
            onClick={addPaymentMethod}
          >
            {processing ? (
              <div className="spinner w-full" id="spinner">
                ...
              </div>
            ) : (
              'Submit'
            )}
          </Button>
        </div>

        {/* Show any error that happens when processing the payment */}
        {error && (
          <div className="text-error" role="alert">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}
