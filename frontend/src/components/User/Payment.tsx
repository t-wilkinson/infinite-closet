import React from 'react'
import axios from 'axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import { StrapiUser } from '@/utils/models'
import { fetchAPI } from '@/utils/api'
import { Icon } from '@/components'
import { Submit } from '@/Form'
import { PaymentWrapper } from '@/Form/Payments'
import { useDispatch } from '@/utils/store'
import { signin } from '@/User'

import './CheckoutForm.module.css'

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
          {...paymentMethod}
        />
      ))}
    </div>
  )
}

const PaymentMethod = ({
  id,
  dispatch,
  state,
  card: { brand, exp_month, exp_year, last4 },
}) => {
  const rootDispatch = useDispatch()
  const removePaymentMethod = () => {
    axios
      .delete(`/account/payment-methods/${id}`, { withCredentials: true })
      .then(() => signin(rootDispatch))
      .catch((err) => console.error(err))
  }

  return (
    <button
      className={`relative flex border bg-gray-light p-4 flex-row cursor-pointer items-center
      ${id === state.paymentMethod ? 'border-black' : ''}
      `}
      aria-label={`Choose ${toTitleCase(brand)}
      card ending in ${last4} which expires on ${exp_month}/${exp_year}
      `}
      onClick={() => dispatch({ type: 'choose-payment-method', payload: id })}
    >
      <button
        className="absolute top-0 right-0 p-2"
        type="button"
        onClick={removePaymentMethod}
      >
        <Icon name="close" size={16} />
      </button>
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
  )
}

const cardStyle = {
  style: {
    base: {
      color: 'black',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#ccc',
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
    <AddPaymentMethodForm user={user} state={state} dispatch={dispatch} />
  </PaymentWrapper>
)

export const AddPaymentMethodForm = ({ user, state, dispatch }) => {
  const [succeeded, setSucceeded] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [processing, setProcessing] = React.useState(false)
  const [disabled, setDisabled] = React.useState(true)
  const [clientSecret, setClientSecret] = React.useState('')
  const [authorised, setAuthorisation] = React.useState(false)
  const stripe = useStripe()
  const elements = useElements()

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

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setProcessing(true)
    const payload = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          // TODO: is it better to include this or ask user for information?
          //   name: user.firstName + ' ' + user.lastName,
          //   email: user.email,
          //   phone: user.phoneNumber,
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
      dispatch({ type: 'close-popup' })
      dispatch({
        type: 'choose-payment-method',
        payload: payload.setupIntent.payment_method,
      })

      // TODO: be nicer with clients data limits
      fetchAPI('/account/payment-methods')
        .then((res) =>
          dispatch({
            type: 'set-payment-methods',
            payload: res.paymentMethods,
          }),
        )
        .catch((err) => console.error(err))
    }
  }

  if (state.popup !== 'payment') {
    return <div />
  }

  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-50 items-center justify-center">
      <form
        id="payment-form"
        className="w-full max-w-sm w-full p-6 bg-white rounded-lg relative"
        onSubmit={(e) => e.preventDefault()}
      >
        <AddPaymentMethodHeader dispatch={dispatch} />

        <div className="my-8 border border-gray rounded-sm p-4">
          <CardElement
            id="card-element"
            options={cardStyle}
            onChange={handleChange}
          />
        </div>

        <Authorise
          setAuthorisation={setAuthorisation}
          authorised={authorised}
        />

        <div className="w-full items-center">
          <Submit
            className="w-full"
            disabled={processing || disabled || succeeded || !authorised}
            onSubmit={onSubmit}
          >
            {processing ? (
              <div className="spinner w-full" id="spinner">
                ...
              </div>
            ) : (
              'Submit'
            )}
          </Submit>
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

const AddPaymentMethodHeader = ({ dispatch }) => (
  <>
    <div className="w-full items-center">
      <span className="font-bold text-3xl mt-2">Add Payment Method</span>
    </div>

    <div className="w-full h-px bg-pri mb-6 mt-1 rounded-full" />

    <button
      className="absolute top-0 right-0 m-3"
      onClick={() => dispatch({ type: 'close-popup' })}
    >
      <Icon name="close" size={20} />
    </button>
  </>
)

const Authorise = ({ setAuthorisation, authorised }) => (
  <button
    onClick={() => setAuthorisation(!authorised)}
    aria-label="Authorize Infinite Closet to handle card details"
  >
    <div className="flex-row items-center">
      <div className="items-center justify-center w-5 h-5 bg-white border border-black rounded-sm mr-4">
        {authorised && <Icon name="check" className="w-3 h-3" />}
      </div>
      <span className="w-full text-left">
        I authorise Infinite Closet to send instructions to the financial
        institution that issued my card to take payments from my card account in
        accordance with the terms of my agreement with you.
      </span>
    </div>
  </button>
)
