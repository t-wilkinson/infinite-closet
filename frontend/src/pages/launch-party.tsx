import React from 'react'
import Image from 'next/image'
import axios from 'axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)

import useAnalytics from '@/utils/useAnalytics'
import { useSelector } from '@/utils/store'
import { Input } from '@/Form'
import useFields, { cleanFields, isError } from '@/Form/useFields'
import '@/User/CheckoutForm.module.css'
import { Button, Hover, Icon } from '@/components'
import { PaymentCard, PaymentWrapper } from '@/Form/Payments'
import Layout from '@/Layout'
import { iconPin, iconClock, iconClose } from '@/components/Icons'

const Page = () => {
  return (
    <Layout title="Launch Party" className="bg-pri-light">
      <div className="w-full items-center flex-grow">
        <div className="w-full max-w-screen-lg items-center px-4 mb-20">
          <Introduction />
          <div className="w-full flex-col-reverse items-center lg:items-start lg:flex-row lg:space-x-8 flex-grow">
            <div className="bg-white w-full p-4 rounded-md shadow-md">
              <LaunchPartyFormWrapper />
            </div>
            <aside className="w-full justify-evenly lg:max-w-xs flex-row flex-wrap">
              <SideBar />
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const Introduction = () => (
  <section className="relative mt-4 mb-8 w-full items-center">
    <div className="relative text-lg text-white md:h-96 w-full rounded-md overflow-hidden">
      <Image
        src="/media/launch-party/toast.jpg"
        priority={true}
        alt=""
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="space-y-2 max-w-screen-md mt-8 mb-4 px-4 md:px-0 relative lg:items-center">
      <h1 className="font-bold text-5xl">Join our Launch Party</h1>
      <span className="lg:text-center text-xl">
        In conjunction with London Fashion Week, Infinite Closet and Give Your
        Best Launch present the Infinite Closet x Give Your Best Launch Party
      </span>
      <div className="lg:hidden">
        <PartyInfo />
      </div>
      <small>Tickets are first come, first serve.</small>
    </div>
  </section>
)

const PartyInfo = () => (
  <>
    <span className="mt-4 lg:mt-0">
      Infinite Closet, London's premier independent designer rental platform,
      and Give Your Best, a non-profit where refugee women can ‘shop’ donated
      clothes for free, are partnering to empower women and improve circularity
      in the fashion industry.
    </span>
    <span>
      Join us on 18 September to learn more about Give Your Best and browse
      clothes from Infinite Closet’s latest designers.
    </span>
  </>
)

const SideBar = () => (
  <>
    <div className="hidden lg:flex">
      <Details>
        <PartyInfo />
      </Details>
    </div>

    <Details>
      <div className="flex-row">
        <Icon icon={iconClock} size={20} className="text-gray mr-6 mt-2" />
        <div className="">
          <span>Saturday, September 18, 2021</span>
          <span>8pm to 12am (BST)</span>
        </div>
      </div>
      <span className="flex flex-row items-center">
        <Icon icon={iconPin} size={20} className="text-gray mr-6" />
        44 Great Cumberland Pl, London W1H 7BS
      </span>
    </Details>

    <Details>
      <DetailItem label="Sarah Korich" text="Founder at Infinite Closet" />
      <DetailItem
        label="Sol Escobar"
        text="Founder & Director at Give Your Best"
      />
      <DetailItem label="Kemi Ogulana" text="volunteer and refugee" />
    </Details>

    <Details>
      <span className="font-bold text-lg mb-1">Order soon</span>
      <DetailItem
        label="Early Bird Tickets (ends 18/08)"
        text="£20, includes a glass of champagne upon arrival"
      />
      <DetailItem label="Regular Tickets (ends 11/09)" text="£30" />
      <DetailItem label="Final Release (ends 18/09 or sold out)" text="£35" />
    </Details>
  </>
)

const Details = ({ children }) => (
  <div className="rounded-md lg:flex-col px-6 py-4 w-full mb-4 max-w-xs h-36 bg-white space-y-2 shadow-md">
    {children}
  </div>
)

const DetailItem = ({ label, text }) => (
  <span>
    <span className="font-bold">{label}</span>, {text}
  </span>
)

type Status = null | 'checking-out' | 'error' | 'success'
type Info = 'info' | 'payment'

const initialState = {
  status: null as Status,
  error: undefined,
  paymentStatus: undefined,
  donation: 0,
  edit: 'info' as Info,
  promoValid: undefined,
  promoDiscount: 0 as number,
  ticketPrice: undefined as number,
}

const reducer = (
  state: typeof initialState,
  action: { type: string; payload?: any }
) => {
  // prettier-ignore
  switch (action.type) {
    case 'try-promo-again': return {...state, promoValid: undefined}
    case 'promo-valid': return {...state, promoValid: true}
    case 'promo-invalid': return {...state, promoValid: false}
    case 'ticket-price': return {...state, ticketPrice: action.payload}
    case 'check-promo-code':
      return {...state, promoValid: action.payload.valid, promoDiscount: action.payload.discount || 0}

    case 'edit-info': return {...state, edit: 'info'}
    case 'edit-payment': return {...state, edit: 'payment'}

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

const StateContext = React.createContext(null)
const DispatchContext = React.createContext(null)

const LaunchPartyFormWrapper = () => {
  const user = useSelector((state) => state.user.data)
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [guests, setGuests] = React.useState<string[]>([])
  const fields = useFields({
    firstName: { constraints: 'required', default: user?.firstName },
    lastName: { constraints: 'required', default: user?.lastName },
    email: { constraints: 'required email', default: user?.email },
    phoneNumber: { constraints: 'phonenumber', default: user?.phoneNumber },
    donation: { label: '', constraints: 'decimal', default: 0 },
    promoCode: {},
  })

  React.useEffect(() => {
    fields.donation.onChange(state.donation)
  }, [state.donation])

  React.useEffect(() => {
    axios
      .get('/launch/party/price')
      .then((res) => res.data)
      .then((price) => dispatch({ type: 'ticket-price', payload: price }))
  }, [])

  if ([state.ticketPrice].some((v) => v === undefined)) {
    return null
  }

  if (state.ticketPrice === -1) {
    return (
      <div className="p-16 text-2xl text-center">
        Release party starts 8pm on Saturday, September 18!
      </div>
    )
  }

  return (
    <PaymentWrapper>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <LaunchPartyForm
            setGuests={setGuests}
            guests={guests}
            fields={fields}
          />
        </DispatchContext.Provider>
      </StateContext.Provider>
    </PaymentWrapper>
  )
}

const LaunchPartyForm = ({ setGuests, guests, fields }) => {
  const state = React.useContext(StateContext)

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
              <AttendeeInfo fields={fields} />
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
              <GuestInfo guests={guests} setGuests={setGuests} />
            </Section>
            <Section title="Donations & Discounts">
              <Discounts fields={fields} />
            </Section>
            <Section title="Summary">
              <Summary fields={fields} guests={guests} />
              <AcceptPayment fields={fields} guests={guests} />
            </Section>
          </div>
        )}
      </form>
    </div>
  )
}

const Section = ({ title, subtitle = null, children }) => (
  <fieldset className="flex flex-col">
    <div className="flex-row items-center mb-4">
      <legend className="font-bold text-lg">{title}</legend>
      {subtitle}
    </div>
    {children}
  </fieldset>
)

const GuestInfo = ({
  guests,
  setGuests,
}: {
  guests: string[]
  setGuests: any
}) => {
  const editGuest = (i: number, value: string) =>
    setGuests((guests: string[]) => {
      const newGuests = [...guests]
      newGuests[i] = value
      return newGuests
    })
  const removeGuest = (i: number) =>
    setGuests((guests: string[]) => [
      ...guests.slice(0, i),
      ...guests.slice(i + 1),
    ])

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
              <Icon icon={iconClose} size={16} />
            </button>
          }
        />
      ))}
    </div>
  )
}

const AttendeeInfo = ({ fields }) => (
  <div className="space-y-4">
    <div className="flex-row space-x-4 -mb-2">
      <Input {...fields.firstName} />
      <Input {...fields.lastName} />
    </div>
    <Input {...fields.email} />
    <Input {...fields.phoneNumber} />
  </div>
)

const Discounts = ({ fields }) => (
  <div className="w-full space-y-4">
    <div className="w-full sm:flex-row mb-2">
      <div className="w-full sm:w-80">
        <PromoCode fields={fields} />
      </div>
      <DonateClothes />
    </div>
    <div className="w-full flex-row">
      <Donation donation={fields.donation} />
    </div>
  </div>
)

const PromoCode = ({ fields }) => {
  const state = React.useContext(StateContext)
  const dispatch = React.useContext(DispatchContext)

  const checkPromo = () =>
    axios
      .get(`/launch/party/promo?code=${fields.promoCode.value}`)
      .then((res) => dispatch({ type: 'check-promo-code', payload: res.data }))
      .catch(() => dispatch({ type: 'promo-invalid' }))
  const ApplyPromoCode = () => (
    <button
      className="flex px-4 py-3 border-l border-gray"
      onClick={checkPromo}
      type="button"
    >
      Apply
    </button>
  )
  const onKeyDown = (e) => {
    if (e.keyCode === 'enter') {
      e.preventDefault()
      checkPromo()
    }
  }
  const retryPromoCode = () => {
    fields.promoCode.onChange('')
    dispatch({ type: 'try-promo-again' })
  }

  if (state.promoValid === undefined) {
    return (
      <Input
        onKeyDown={onKeyDown}
        {...fields.promoCode}
        after={<ApplyPromoCode />}
      />
    )
  } else if (state.promoValid === true) {
    return <span className="w-full p-2">Successfully applied promo code!</span>
  } else {
    return (
      <span className="text-warning w-full p-2">
        Unable to find promo code matching {fields.promoCode.value}.{' '}
        <button className="underline text-black" onClick={retryPromoCode}>
          Try Again?
        </button>
      </span>
    )
  }
}

const DonateClothes = () => (
  <div className="sm:ml-8 w-full space-y-2">
    <q className="">
      Have some gently loved clothes to donate? Get £5 off your ticket price
      with 2 clothing donations on the day of the event for{' '}
      <a
        href="https://www.giveyourbest.uk/"
        target="_blank"
        className="underline"
      >
        Give Your Best
      </a>
      . Use promo code GIVEYOURBEST.
    </q>
    <small>*At this time we can only accept women’s clothing donations.</small>
  </div>
)

const Donation = ({ donation }) => {
  const state = React.useContext(StateContext)

  return (
    <div className="w-full">
      <div className="w-full flex-row flex-wrap items-center">
        Additional Donation
        <Hover>
          Give Your Best connects pre-loved clothes with those who don't just
          need them, but choose them.
        </Hover>
      </div>

      <div className="flex-row items-center">
        <div className="w-24 mr-4">
          <Input {...donation} before={<span className="ml-2">£</span>}></Input>
        </div>
        <div className="flex-wrap space-y-2 xs:space-y-0 xs:flex-row xs:space-x-2 items-center">
          {[1, 5, 10, 30].map((amount) => (
            <DonationAddition
              key={amount}
              amount={amount}
              selected={state.donation === amount}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const Summary = ({ fields, guests }) => {
  const state = React.useContext(StateContext)

  return (
    <div>
      <Price label="Ticket Price" price={state.ticketPrice} />
      <Price label="Promo Discount" price={state.promoDiscount} negative />
      <Price label="Guest Tickets" price={guests.length * state.ticketPrice} />

      <div className="mb-4 w-full flex-row justify-between items-center font-bold">
        <span className="">Total</span>
        <span className="">
          £
          {(
            parseFloat(fields.donation.value) +
            state.ticketPrice +
            state.ticketPrice * guests.length -
            state.promoDiscount
          ).toFixed(2)}
        </span>
      </div>
    </div>
  )
}

const Price = ({ label, price, negative = false }) => (
  <div className="mb-2 w-full flex-row justify-between items-center">
    <span>{label}</span>
    <span>
      {negative ? '-' : ''}£{(price || 0).toFixed(2)}
    </span>
  </div>
)

const AcceptPayment = ({ fields, guests }) => {
  const state = React.useContext(StateContext)
  const dispatch = React.useContext(DispatchContext)
  const handleChange = async (event) => {
    if (event.error) {
      dispatch({ type: 'payment-error', payload: event.error?.message })
    } else {
      dispatch({ type: 'payment-progress' })
    }
  }

  return (
    <div>
      <PaymentCard handleChange={handleChange} />

      <div className="w-full items-center">
        {state.error && (
          <div className="text-warning card-error" role="alert">
            {state.error}
          </div>
        )}
      </div>

      <Submit guests={guests} fields={fields} />
    </div>
  )
}

const DonationAddition = ({ amount, selected }) => {
  const dispatch = React.useContext(DispatchContext)
  return (
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
}

const Submit = ({ fields, guests }) => {
  const state = React.useContext(StateContext)
  const dispatch = React.useContext(DispatchContext)
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
          return Promise.reject(res.error)
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
      <div className="w-full mt-4">
        <Button
          onClick={onSubmit}
          disabled={
            !isError(fields) ||
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
        </Button>
      </div>
    </div>
  )
}

function handleServerResponse(response, stripe, dispatch) {
  if (response.error) {
    // Show error from server on payment form
    dispatch({ type: 'payment-failed', payload: 'Unable to process payment' })
  } else if (response.status === 'no-charge') {
    dispatch({ type: 'payment-succeeded' })
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
      .post('/launch/party/join', {
        paymentIntent: result.paymentIntent.id,
      })
      .then((res) => handleServerResponse(res.data, stripe, dispatch))
  }
}

export default Page
