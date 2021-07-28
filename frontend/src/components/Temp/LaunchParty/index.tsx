import React from 'react'
import axios from 'axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import useAnalytics from '@/utils/useAnalytics'
import { Icon, Divider, Hover } from '@/components'
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
  const [guests, setGuests] = React.useState<string[]>([])
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
        {state.paymentStatus === 'succeeded' ? (
          <div className="w-full h-64 justify-center items-center">
            <span className="font-bold text-xl">Thank You!</span>
          </div>
        ) : (
          <div className="space-y-8">
            <Section title="How can we contact you?">
              <UserInfo dispatch={dispatch} fields={fields} />
            </Section>
            <Section
              title="Bringing any guests?"
              subtitle={
                <button
                  onClick={() => setGuests((guests) => [...guests, ''])}
                  type="button"
                  className="ml-2 underline flex items-center"
                >
                  Add a Guest
                </button>
              }
            >
              <GuestInfo
                dispatch={dispatch}
                fields={fields}
                guests={guests}
                setGuests={setGuests}
              />
            </Section>
            <Section title="Donations & Discounts">
              <Misc fields={fields} dispatch={dispatch} state={state} />
            </Section>
            <Section title="Summary">
              <Pay
                fields={fields}
                guests={guests}
                dispatch={dispatch}
                state={state}
              />
            </Section>
          </div>
        )}
      </form>
    </div>
  )
}

const Section = ({ title, subtitle = null, children }) => (
  <div>
    <div className="flex-row items-center mb-4">
      <strong className="text-lg">{title}</strong>
      {subtitle}
    </div>
    {children}
  </div>
)

const GuestInfo = ({ fields, dispatch, guests, setGuests }) => {
  const editGuest = (i, value) =>
    setGuests((guests) => {
      const newGuests = [...guests]
      newGuests[i] = value
      return newGuests
    })
  const removeGuest = (i) =>
    setGuests((guests) => [...guests.slice(0, i), ...guests.slice(i + 1)])

  return (
    <div className="space-y-4">
      {guests.map((guest, i) => (
        <Input
          key={i}
          label={`Guest Name`}
          value={guest}
          onChange={(value) => editGuest(i, value)}
          after={
            <button
              type="button"
              className="text-warning p-2"
              aria-label={`Remove guest ${i}`}
              onClick={() => removeGuest(i)}
            >
              <Icon name="close" size={16} />
            </button>
          }
        />
      ))}
    </div>
  )
}

const UserInfo = ({ fields, dispatch }) => {
  // const disabled = !isValid(fields, [
  //   'firstName',
  //   'lastName',
  //   'email',
  //   'phoneNumber',
  // ])

  return (
    <div className="space-y-4">
      <div className="flex-row space-x-4 -mb-2">
        <Input {...fields.firstName} />
        <Input {...fields.lastName} />
      </div>
      <Input {...fields.email} />
      <Input {...fields.phoneNumber} />
      {/* <div className="w-full"> */}
      {/*   <CallToAction */}
      {/*     onClick={() => dispatch({ type: 'edit-payment' })} */}
      {/*     disabled={disabled} */}
      {/*     className={`mt-2 */}
      {/*     `} */}
      {/*     type="button" */}
      {/*   > */}
      {/*     Continue */}
      {/*   </CallToAction> */}
      {/* </div> */}
    </div>
  )
}

const Price = ({ label, price, minus = false }) => (
  <div className="mb-2 w-full flex-row justify-between items-center">
    <span>{label}</span>
    <span>
      {minus ? '-' : ''}£{price.toFixed(2)}
    </span>
  </div>
)

const Misc = ({ fields, dispatch, state }) => (
  <div className="space-y-4">
    <div>
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
            *At this time we can only accept women’s clothing donations.
          </small>
        </div>
      </div>
    </div>

    <div className="flex-row">
      <Donation donation={fields.donation} state={state} dispatch={dispatch} />
    </div>
  </div>
)

const Pay = ({ fields, dispatch, state, guests }) => {
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
    <div className="space-y-4">
      <div>
        <Price label="Ticket Price" price={TICKET_PRICE} />
        <Price label="Promo Discount" price={discount} minus />
        <Price label="Guest Tickets" price={guests.length * TICKET_PRICE} />

        <div className="mb-4 w-full flex-row justify-between items-center font-bold">
          <span className="">Total</span>
          <span className="">
            £
            {(
              parseFloat(fields.donation.value) +
              TICKET_PRICE +
              TICKET_PRICE * guests.length -
              discount
            ).toFixed(2)}
          </span>
        </div>

        <PaymentCard handleChange={handleChange} />

        <div className="w-full items-center">
          {state.error && (
            <div className="text-warning card-error" role="alert">
              {state.error}
            </div>
          )}
        </div>

        <Join
          guests={guests}
          fields={fields}
          state={state}
          dispatch={dispatch}
        />
      </div>
    </div>
  )
}

const PromoCode = ({ state, fields, dispatch }) => {
  const checkPromo = () =>
    axios
      .get(`/launch/party/promo?code=${fields.promoCode.value}`)
      .then((res) =>
        res.data
          ? dispatch({ type: 'promo-valid' })
          : dispatch({ type: 'promo-invalid' })
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
    <div className="">
      <div className="flex-row items-center">
        Additional Donation
        <Hover>
          Give Your Best connects pre-loved clothes with those who don't just
          need them, but choose them.
        </Hover>
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

const Join = ({ dispatch, state, fields, guests }) => {
  const elements = useElements()
  const stripe = useStripe()
  const analytics = useAnalytics()

  const onSubmit = async (ev) => {
    ev.preventDefault()
    dispatch({ type: 'payment-processing' })
    const cleaned = cleanFields(fields)

    analytics.logEvent('form_submit', {
      type: 'launch-party.join',
      user: cleaned.email,
    })

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
            guests,
            name: `${cleaned.firstName} ${cleaned.lastName}`,
            firstName: cleaned.firstName,
            lastName: cleaned.lastName,
            email: cleaned.email,
            phone: cleaned.phoneNumber ? cleaned.phoneNumber : undefined,
            paymentMethod: res.paymentMethod.id,
            donation: parseFloat(cleaned.donation),
            promoCode: state.promoValid ? cleaned.promoCode : null,
          })
        }
      })

      .then((res) => handleServerResponse(res.data, stripe, dispatch))

      .then(() =>
        window.localStorage.setItem('launch-party', JSON.stringify(true))
      )

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
      {/* <button */}
      {/*   className="flex w-32 mt-3 items-center flex-col border border-gray rounded-sm p-3 mr-4" */}
      {/*   type="button" */}
      {/*   onClick={() => dispatch({ type: 'edit-info' })} */}
      {/* > */}
      {/*   Back */}
      {/* </button> */}
      <div className="w-full mt-4">
        <Submit
          onSubmit={onSubmit}
          disabled={
            !isValid(fields) ||
            ['disabled', 'processing', 'succeeded'].includes(
              state.paymentStatus
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
              'Join the party'
            )}
          </span>
        </Submit>
      </div>
    </div>
  )
}

export default JoinLaunchParty
