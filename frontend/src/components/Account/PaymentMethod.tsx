import React from 'react'
import axios from 'axios'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// import { getURL } from '@/utils/api'
// import { Submit } from '@/Form'
// import resolveConfig from 'tailwindcss/resolveConfig'
// import tailwindConfig from 'tailwind.config'
import { StrapiUser } from '@/utils/models'

import './CheckoutForm.module.css'

// const fullConfig = resolveConfig(tailwindConfig)
const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

export const PaymentMethods = ({ user, state, dispatch }) => {
  return (
    <div className="items-center w-full">
      {JSON.stringify(state.paymentMethods)}
    </div>
  )
}

const cardStyle = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#32325d',
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
}

export const AddPaymentMethod = ({
  user,
}: // state,
// dispatch,
AddPaymentMethod) => (
  <Elements stripe={promise}>
    <AddPaymentMethodForm user={user} />
  </Elements>
)

export const AddPaymentMethodForm = ({ user }) => {
  const [succeeded, setSucceeded] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [processing, setProcessing] = React.useState(false)
  const [disabled, setDisabled] = React.useState(true)
  const [clientSecret, setClientSecret] = React.useState('')
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
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.firstName + ' ' + user.lastName,
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
    }
  }

  return (
    <form id="payment-form" onSubmit={onSubmit}>
      <CardElement
        id="card-element"
        options={cardStyle}
        onChange={handleChange}
      />
      <button disabled={processing || disabled || succeeded} id="submit">
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            'Pay now'
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
      <p className={succeeded ? 'result-message' : 'result-message hidden'}>
        Payment succeeded, see the result in your
        <a href={`https://dashboard.stripe.com/test/payments`}>
          {' '}
          Stripe dashboard.
        </a>{' '}
        Refresh the page to pay again.
      </p>
    </form>
  )
}

export default PaymentMethods
