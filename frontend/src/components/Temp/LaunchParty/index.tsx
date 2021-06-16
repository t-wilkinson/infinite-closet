import React from 'react'
import axios from 'axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import { CallToAction, Hover } from '@/components'
import { useSelector } from '@/utils/store'
import { Input, Submit } from '@/Form'
import useFields, { cleanFields, isValid } from '@/Form/useFields'
import { PaymentCard } from '@/Form/Payments'
import '@/User/CheckoutForm.module.css'

import {
  TICKET_PRICE,
  GIVEYOURBEST_DISCOUNT,
  PROMO_DISCOUNT,
} from './constants'
import { handleServerResponse } from './helpers'
import { reducer, initialState } from './reducer'

export const JoinLaunchParty = () => {
  const user = useSelector((state) => state.user.data)
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const fields = useFields({
    firstName: {
      constraints: 'required',
      default: !user ? '' : user.firstName,
    },
    lastName: {
      constraints: 'required',
      default: !user ? '' : user.lastName,
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
    promoCode: {},
  })

  React.useEffect(() => {
    fields.donation.onChange(state.donation)
  }, [state.donation])

  return (
    <div className="w-full">
      <form id="payment-form">
        {state.edit === 'info' ? (
          <UserInfo dispatch={dispatch} fields={fields} />
        ) : (
          <Pay fields={fields} dispatch={dispatch} state={state} />
        )}
        {state.error && (
          <div className="text-warning card-error" role="alert">
            {state.error}
          </div>
        )}
      </form>
    </div>
  )
}

const UserInfo = ({ fields, dispatch }) => {
  const disabled = !isValid(fields, [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
  ])

  return (
    <>
      <div className="flex-row space-x-4">
        <Input {...fields.firstName} />
        <Input {...fields.lastName} />
      </div>
      <Input {...fields.email} />
      <Input {...fields.phoneNumber} />
      <div className="w-full">
        <CallToAction
          onClick={() => dispatch({ type: 'edit-payment' })}
          disabled={disabled}
          className={`mt-2 ${disabled ? 'bg-pri-light' : 'bg-pri'}`}
          type="button"
        >
          Continue
        </CallToAction>
      </div>
    </>
  )
}

const Pay = ({ fields, dispatch, state }) => {
  const handleChange = async (event) => {
    if (event.error) {
      dispatch({ type: 'payment-error', payload: event.error?.message })
    } else {
      dispatch({ type: 'payment-progress' })
    }
  }

  const discount =
    fields.promoCode.value === 'GIVEYOURBEST'
      ? GIVEYOURBEST_DISCOUNT
      : state.promoValid
      ? PROMO_DISCOUNT
      : 0

  return (
    <>
      <div className="flex-row mb-2">
        <div className="w-80">
          <PromoCode state={state} dispatch={dispatch} fields={fields} />
        </div>
        <div className="ml-8 w-full space-y-2">
          <q className="">
            Have some gently loved clothes to donate? Get £5 off your ticket
            price with 2 clothing donations on the day of the event for{' '}
            <a
              href="https://www.giveyourbest.uk/"
              target="_blank"
              className="underline"
            >
              Give Your Best
            </a>
            . Use promo code GIVEYOURBEST.
          </q>
          <small>
            *At this time we can only accept women’s clothing donations.*
          </small>
        </div>
      </div>

      <div className="mb-2 w-full flex-row justify-between items-center">
        <span>Promo Discount</span>
        <span className="">-£{discount.toFixed(2)}</span>
      </div>

      <div className="mb-2 w-full flex-row justify-between items-center">
        <span>Ticket Price</span>
        <span className="">£{TICKET_PRICE.toFixed(2)}</span>
      </div>

      <div className="flex-row mb-2">
        <Donation
          donation={fields.donation}
          state={state}
          dispatch={dispatch}
        />
      </div>

      <div className="mb-4 w-full flex-row justify-between items-center font-bold">
        <span className="">Total</span>
        <span className="">
          £
          {(
            parseFloat(fields.donation.value) +
            TICKET_PRICE -
            discount
          ).toFixed(2)}
        </span>
      </div>

      <PaymentCard handleChange={handleChange} />

      <Join fields={fields} state={state} dispatch={dispatch} />
    </>
  )
}

const PromoCode = ({ state, fields, dispatch }) => {
  const checkPromo = () =>
    axios
      .get(`/launch/party/promo?code=${fields.promoCode.value}`)
      .then((res) =>
        res.data
          ? dispatch({ type: 'promo-valid' })
          : dispatch({ type: 'promo-invalid' }),
      )
      .catch(() => dispatch({ type: 'promo-invalid' }))

  if (state.promoValid === undefined) {
    return (
      <Input
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            e.preventDefault()
            checkPromo()
          }
        }}
        {...fields.promoCode}
        after={
          <button
            className="flex px-4 py-3 border-l border-gray"
            onClick={checkPromo}
            type="button"
          >
            Apply
          </button>
        }
      />
    )
  } else if (state.promoValid === true) {
    return <span className="w-full p-2">Successfully applied promo code!</span>
  } else {
    return (
      <span className="text-warning w-full p-2">
        Unable to find promo code matching {fields.promoCode.value}.{' '}
        <button
          className="underline text-black"
          onClick={() => {
            fields.promoCode.onChange('')
            dispatch({ type: 'try-promo-again' })
          }}
        >
          Try Again?
        </button>
      </span>
    )
  }
}

const Donation = ({ dispatch, state, donation }) => {
  return (
    <div className="mb-4">
      <div className="flex-row items-center">
        Additional Donation
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
        <div className="w-24 mr-4">
          <Input {...donation} before={<span>£</span>}></Input>
        </div>
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
      </div>
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
          name: `${cleaned.firstName} ${cleaned.lastName}`,
          email: cleaned.email,
          phone: cleaned.phoneNumber ? cleaned.phoneNumber : undefined,
        },
      })

      .then((res) => {
        if (res.error) {
          throw res.error
        } else {
          return axios.post('/launch/party/join', {
            name: `${cleaned.firstName} ${cleaned.lastName}`,
            email: cleaned.email,
            phone: cleaned.phoneNumber ? cleaned.phoneNumber : undefined,
            paymentMethod: res.paymentMethod.id,
            donation: cleaned.donation,
            promoCode: state.promoValid ? cleaned.promoCode : '',
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
    <div className="w-full flex-row items-center">
      <button
        className="flex w-32 mt-4 items-center flex-col border border-gray rounded-sm p-4 mr-4"
        type="button"
        onClick={() => dispatch({ type: 'edit-info' })}
      >
        Back
      </button>
      <div className="w-full">
        <Submit
          onSubmit={onSubmit}
          disabled={
            !isValid(fields) ||
            ['disabled', 'processing', 'succeeded'].includes(
              state.paymentStatus,
            )
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
    </div>
  )
}

export default JoinLaunchParty
