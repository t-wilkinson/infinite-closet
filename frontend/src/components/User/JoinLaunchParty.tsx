import React from 'react'
import axios from 'axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import { useSelector } from '@/utils/store'
import { Input, Submit } from '@/Form'
import useFields, { cleanFields, isValid } from '@/Form/useFields'
import { PaymentCard } from '@/Form/Payments'
import '@/User/CheckoutForm.module.css'

type Status = null | 'checking-out' | 'error' | 'success'
type Hover = null | 'donation'

const initialState = {
  status: null as Status,
  error: undefined,
  paymentStatus: undefined,
  donation: 0,
  hover: null,
}

const TICKET_PRICE = 35

const reducer = (state, action) => {
  // prettier-ignore
  switch (action.type) {
    case 'hover-donation': return {...state, hover: 'donation'}
    case 'hover-leave': return {...state, hover: null}

    case 'donation-amount': return {...state, donation: action.payload}

    case 'status-checkout': return {...state, status: 'checking-out'}
    case 'status-error': return {...state, status: 'error'}
    case 'status-success': return {...state, status: 'success'}

    case 'payment-progress': return { ...state, paymentStatus:undefined, error: undefined }
    case 'payment-error': return { ...state, paymentStatus: 'disabled', error: action.payload }
    case 'payment-succeeded': return { ...state, paymentStatus: action.payload ?? 'succeeded', error: undefined, }
    case 'payment-processing': return { ...state, paymentStatus: 'processing' }
    case 'payment-failed': {
      let error: string
      if (action.payload.error?.message) {
        error = `Payment failed ${action.payload.error.message}`
      } else {
        error = `Payment failed`
      }
      return { ...state, paymentStatus: 'failed', error: error }
    }

    default: return state
  }
}

export const JoinLaunchParty = () => {
  const user = useSelector((state) => state.user.data)
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const fields = useFields({
    name: {
      constraints: 'required',
      default: !user ? '' : `${user.firstName} ${user.lastName}`,
    },
    email: {
      constraints: 'required email',
      default: !user ? '' : user.email,
    },
    phoneNumber: {
      constraints: 'phonenumber',
      default: !user ? '' : user.phoneNumber,
    },
    donation: {
      label: '',
      constraints: 'decimal',
      default: 0,
    },
  })

  const handleChange = async (event) => {
    if (event.error) {
      dispatch({ type: 'payment-error', payload: event.error?.message })
    } else {
      dispatch({ type: 'payment-progress' })
    }
  }

  React.useEffect(() => {
    fields.donation.onChange(state.donation)
  }, [state.donation])

  return (
    <div className="w-full">
      <form id="payment-form">
        <Input {...fields.name} />
        <Input {...fields.email} />
        <Input {...fields.phoneNumber} />

        <div className="mt-4" />

        <div className="mb-4">
          <div className="flex-row items-center">
            Donation Amount
            <span
              className="w-5 h-5 ml-1 text-xs bg-sec-light rounded-full inline-block flex items-center justify-center relative"
              onMouseEnter={() => dispatch({ type: 'hover-donation' })}
              onMouseLeave={() => dispatch({ type: 'hover-leave' })}
            >
              ?
              {state.hover === 'donation' && (
                <div className="absolute left-0 mt-4 ml-4 w-48 h-16 bg-white border border-gray rounded-md z-10 p-4">
                  Something about organization
                </div>
              )}
            </span>
          </div>

          <div className="flex-row items-center">
            <div className="w-24 mr-4 font-bold text-xl">
              <Input {...fields.donation} before={<span>£</span>}></Input>
            </div>
            <Donation state={state} dispatch={dispatch} />
          </div>
        </div>

        <div className="mb-4">
          <span>Ticket Price</span>
          <span className="font-bold text-xl">£{TICKET_PRICE.toFixed(2)}</span>
        </div>

        <div className="mb-4">
          <span className="">Total</span>
          <span className="font-bold text-xl">
            £{(parseFloat(fields.donation.value) + TICKET_PRICE).toFixed(2)}
          </span>
        </div>

        <PaymentCard handleChange={handleChange} />

        <Join fields={fields} state={state} dispatch={dispatch} />

        {state.error && (
          <div className="text-warning card-error" role="alert">
            {state.error}
          </div>
        )}
      </form>
    </div>
  )
}

const Donation = ({ dispatch, state }) => {
  return (
    <div className="flex-row space-x-2 items-center">
      {[1, 5, 10, 30].map((amount) => (
        <DonationAddition
          key={amount}
          dispatch={dispatch}
          amount={amount}
          selected={state.donation === amount}
        />
      ))}
    </div>
  )
}

const DonationAddition = ({ dispatch, amount, selected }) => (
  <button
    aria-label="Change donation amount"
    type="button"
    onClick={() => dispatch({ type: 'donation-amount', payload: amount })}
    className={`flex rounded-full h-10 w-10 p-1 items-center justify-center border border-gray
    ${selected ? 'text-white bg-pri' : ''}
    `}
  >
    <span>£{amount}</span>
  </button>
)

const Join = ({ dispatch, state, fields }) => {
  const elements = useElements()
  const stripe = useStripe()

  const onSubmit = async (ev) => {
    ev.preventDefault()
    dispatch({ type: 'payment-processing' })
    const cleaned = cleanFields(fields)

    stripe
      .createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: cleaned.name,
          email: cleaned.email,
          phone: cleaned.phoneNumber ? cleaned.phoneNumber : undefined,
        },
      })

      .then((res) => {
        if (res.error) {
          throw res.error
        } else {
          return axios.post('/launch-party/join', {
            paymentMethod: res.paymentMethod.id,
            donation: cleaned.donation,
          })
        }
      })

      .then((res) => {
        return handleServerResponse(res.data, stripe, dispatch)
      })

      .catch((err) => {
        dispatch({ type: 'payment-failed', payload: err })
        if (!err.error) {
          // not a stripe error, print it to console to debug
          console.error(err)
        }
      })
  }

  return (
    <div className="w-full">
      <Submit
        onSubmit={onSubmit}
        disabled={
          !isValid(fields) ||
          ['disabled', 'processing', 'succeeded'].includes(state.paymentStatus)
        }
      >
        <span id="button-text">
          {state.paymentStatus === 'processing' ? (
            <div className="spinner" id="spinner">
              Processing...
            </div>
          ) : state.paymentStatus === 'succeeded' ? (
            <span>Thank You</span>
          ) : (
            'Pay now'
          )}
        </span>
      </Submit>
    </div>
  )
}

function handleServerResponse(response, stripe, dispatch) {
  if (response.error) {
    // Show error from server on payment form
    dispatch({ type: 'payment-failed', payload: 'Unable to process payment' })
  } else if (response.requires_action) {
    // Use Stripe.js to handle required card action
    stripe
      .handleCardAction(response.payment_intent_client_secret)
      .then((res) => handleStripeJsResult(res, stripe, dispatch))
  } else {
    dispatch({ type: 'payment-succeeded' })
  }
}

function handleStripeJsResult(result, stripe, dispatch) {
  if (result.error) {
    dispatch({ type: 'payment-failed', payload: result.error })
  } else {
    // The card action has been handled
    // The PaymentIntent can be confirmed again on the server
    axios
      .post('/launch-party/join', {
        paymentIntent: result.paymentIntent.id,
      })
      .then((res) => handleServerResponse(res.data, stripe, dispatch))
  }
}

export default JoinLaunchParty
