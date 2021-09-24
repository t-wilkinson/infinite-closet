import React from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  PaymentRequestButtonElement,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
dayjs.extend(utc)

import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import { fmtPrice } from '@/utils/helpers'
import { Submit, CouponCode, Input } from '@/Form'
import useFields, { cleanFields, isValid } from '@/Form/useFields'
import { BlueLink } from '@/components'
import { CartUtils } from '@/Cart/slice'
import Cart from '@/Cart'

import { cardStyle, Authorise } from '@/User/Payment'
import { PaymentWrapper } from '@/Form/Payments'
import { validatePostcode, useAddressFields } from '@/User/Address'

type Status = null | 'checking-out' | 'error' | 'success'

const initialState = {
  error: undefined,
  status: null as Status,
  authorised: false,
  coupon: undefined,
}

const reducer = (state: typeof initialState, action: any) => {
  const def = (key: string) => ({ ...state, [key]: action.payload })
  // prettier-ignore
  switch (action.type) {
    case 'correct-coupon': return def('coupon')
    case 'clear-coupon': return {...state, coupon: undefined,}
    case 'authorise': return {...state, authorised: true}
    case 'un-authorise': return {...state, authorised: false}

    case 'set-payment-method': return def('paymentMethod')

    case 'status-clear': return {...state, status: null, error: ''}
    case 'status-processing': return {...state, status: 'processing'}
    case 'status-success': return {...state, status: 'success'}
    case 'status-error': return {...state, status: 'error', error: action.payload}

    default: return state
  }
}

const StateContext = React.createContext(null)
const DispatchContext = React.createContext(null)
const FieldsContext = React.createContext(null)
const AddressContext = React.createContext(null)

export const CheckoutContextWrapper = ({}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const rootDispatch = useDispatch()
  const analytics = useAnalytics()
  const cart = useSelector((state) => state.cart.checkoutCart)
  const fields = useFields({
    couponCode: {},
    email: { constraints: 'required string' },
  })
  const address = useAddressFields()

  const fetchCart = async () => {
    rootDispatch(CartUtils.view())
    rootDispatch(CartUtils.summary())
  }

  React.useEffect(() => {
    analytics.logEvent('view_cart', {
      user: 'guest',
    })
  }, [])

  React.useEffect(() => {
    rootDispatch(CartUtils.summary())
  }, [cart])

  React.useEffect(() => {
    fetchCart()
  }, [])

  return (
    <div className="w-full flex-grow items-center bg-gray-light px-4 pt-4">
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <FieldsContext.Provider value={fields}>
            <AddressContext.Provider value={address}>
              <PaymentWrapper>
                <CheckoutWrapper fetchCart={fetchCart} />
              </PaymentWrapper>
            </AddressContext.Provider>
          </FieldsContext.Provider>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
  )
}

const CheckoutWrapper = ({ fetchCart }) => {
  const state = React.useContext(StateContext)
  const cartCount = useSelector((state) => state.cart.count)

  return (
    <div
      className="w-full justify-center max-w-screen-xl my-4 h-full
      md:flex-row space-y-4 md:space-y-0 md:space-x-4
      "
    >
      {state.status === 'success' ? (
        <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-32">
          <span className="font-bold text-xl flex flex-col items-center">
            Thank you for your purchase!
          </span>
        </div>
      ) : cartCount === 0 ? (
        <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-32">
          <span className="font-bold text-xl flex flex-col items-center">
            <div>Hmm... Your cart looks empty. </div>
            <div>
              <BlueLink
                href="/products/clothing"
                label="Would you like to browse our collection?"
              />
            </div>
          </span>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <Cart />

          <PaymentRequest fetchCart={fetchCart} />
        </div>
      )}
    </div>
  )
}

const CheckoutForm = ({ checkout }) => {
  const state = React.useContext(StateContext)
  const fields = React.useContext(FieldsContext)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const address = React.useContext(AddressContext)

  return (
    <div className="py-8 -mx-4 px-4 sm:mx-0 sm:px-0 bg-white items-center ">
      <div className="max-w-screen-sm space-y-8">
        <SideItem label="Address">
          <Address address={address} email={fields.email} />
        </SideItem>
        <SideItem label="Payment Method">
          <Payment />
        </SideItem>
        <SideItem label="Summary">
          <Summary summary={summary} />
        </SideItem>
        <div className="mt-4 w-full">
          <Submit
            onSubmit={checkout}
            disabled={
              ['error', 'processing'].includes(state.status) ||
              !isValid(address) ||
              cart.every(isOrderInvalid)
            }
          >
            {state.status === 'checking-out'
              ? 'Checkout Out...'
              : state.status === 'error'
              ? 'Oops... We ran into an issue'
              : state.status === 'success'
              ? 'Successfully Checked Out'
              : cart.every(isOrderInvalid)
              ? 'No Available Items'
              : cart.some(isOrderInvalid)
              ? 'Checkout Available Items'
              : 'Secure Checkout'}
          </Submit>
        </div>
      </div>
    </div>
  )
}

const isOrderInvalid = (order: { valid: boolean }) => !order.valid

const SideItem = ({ label, children }) => (
  <div>
    <span className="font-subheader text-xl">
      {label}
      <div className="w-full h-px bg-pri mt-2 mb-2" />
    </span>
    {children}
  </div>
)

const Address = ({ email, address }) => {
  return (
    <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4">
      {Object.keys(address).map((field) => (
        <Input key={field} {...address[field]} />
      ))}
      <Input {...email} />
    </div>
  )
}

const Payment = () => {
  const state = React.useContext(StateContext)
  const dispatch = React.useContext(DispatchContext)

  const handleChange = async (event: any) => {
    if (event.error) {
      dispatch({
        type: 'status-error',
        payload: event.error ? event.error.message : '',
      })
    } else {
      dispatch({ type: 'status-clear' })
    }
  }

  return (
    <>
      <div className="mb-4 mt-2 border border-gray rounded-sm p-4">
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
      </div>
      {/* Show any error that happens when processing the payment */}
      {state.error && (
        <div className="text-error" role="alert">
          {state.error}
        </div>
      )}
      <Authorise
        setAuthorisation={(allowed: boolean) =>
          allowed
            ? dispatch({ type: 'authorise' })
            : dispatch({ type: 'un-authorise' })
        }
        authorised={state.authorised}
      />
    </>
  )
}

const PaymentRequest = ({ fetchCart }) => {
  const stripe = useStripe()
  const state = React.useContext(StateContext)
  const dispatch = React.useContext(DispatchContext)
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const address = React.useContext(AddressContext)
  const fields = React.useContext(FieldsContext)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const { couponCode } = React.useContext(FieldsContext)
  const [paymentRequest, setPaymentRequest] = React.useState(null)
  const [paymentIntent, setPaymentIntent] = React.useState(null)

  const analytics = useAnalytics()
  const elements = useElements()
  const rootDispatch = useDispatch()

  const checkout = () => {
    dispatch({ type: 'status-processing' })
    const cleaned = cleanFields(fields)
    const cleanedAddress = cleanFields(address)

    validatePostcode(address.postcode)
      .then(() =>
        stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${cleanedAddress.firstName} ${cleanedAddress.lastName}`,
            email: cleaned.email,
            phone: cleanedAddress.mobileNumber,
          },
        })
      )

      .then((res) => {
        if (res.error) {
          return Promise.reject(res.error)
        } else {
          return axios.post('/orders/checkout', {
            address: state.address,
            paymentMethod: res.paymentMethod.id,
            cart: cart.map((item) => item.order),
            couponCode: cleaned.couponCode,
          })
        }
      })

      .then((res) => handleServerResponse(res.data, stripe, dispatch))

      .then(() => {
        rootDispatch(CartUtils.set([]))
        fetchCart()
        dispatch({ type: 'payment-succeeded' })
        analytics.logEvent('purchase', {
          user: 'guest',
          type: 'checkout',
        })
      })

      .catch((err) => {
        console.error(err)
        dispatch({ type: 'status-error' })
      })
  }

  React.useEffect(() => {
    if (paymentIntent) {
      axios
        .put(`/orders/checkout/payment-intents/${paymentIntent.id}`, {
          couponCode: couponCode.value,
          cart: cart.map((item) => item.order),
        })
        .then((res) => res.data)
        .then((res) => setPaymentIntent(res))
        .catch(() => setPaymentIntent(null))
    } else {
      axios
        .post('/orders/checkout/payment-intents', {
          couponCode: couponCode.value,
          cart: cart.map((item) => item.order),
        })
        .then((res) => res.data)
        .then((res) => setPaymentIntent(res))
        .catch(() => setPaymentIntent(null))
    }
  }, [cart])

  React.useEffect(() => {
    if (!stripe || !paymentIntent) return
    const pr = stripe.paymentRequest({
      country: 'GB',
      currency: 'gbp',
      total: {
        label: 'Checkout total',
        amount: paymentIntent.amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestShipping: true,
      shippingOptions: [
        {
          id: 'default-shipping',
          label: 'Zero Emission Delivery',
          detail: 'Carbon-neutral shipping by Hived',
          amount: summary.shipping,
        },
      ],
    })

    // Check the availability of the Payment Request API.
    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr)
      }
    })
  }, [stripe, paymentIntent])

  React.useEffect(() => {
    if (!stripe || !paymentRequest || !paymentIntent || !summary) return
    paymentRequest.update({
      total: {
        label: 'Checkout total',
        amount: paymentIntent.amount,
      },
      shippingOptions: [
        {
          id: 'default-shipping',
          label: 'Zero Emission Delivery',
          detail: 'Carbon-neutral shipping by Hived',
          amount: summary.shipping,
        },
      ],
    })
  }, [paymentRequest, paymentIntent, summary])

  React.useEffect(() => {
    if (!paymentRequest || !paymentIntent) return

    const { client_secret: clientSecret } = paymentIntent

    paymentRequest.on('paymentmethod', async (ev: any) => {
      // Confirm the PaymentIntent without handling potential next actions (yet).
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        )

      if (confirmError) {
        // Report to the browser that the payment failed, prompting it to
        // re-show the payment interface, or show an error message and close
        // the payment interface.
        ev.complete('fail')
      } else {
        // Report to the browser that the confirmation was successful, prompting
        // it to close the browser payment method collection interface.
        ev.complete('success')
        // Check if the PaymentIntent requires any actions and if so let Stripe.js
        // handle the flow. If using an API version older than "2019-02-11"
        // instead check for: `paymentIntent.status === "requires_source_action"`.
        if (paymentIntent.status === 'requires_action') {
          // Let Stripe.js handle the rest of the payment flow.
          const { error } = await stripe.confirmCardPayment(clientSecret)
          if (error) {
            // The payment failed -- ask your customer for a new payment method.
            setPaymentRequest(null)
          } else {
            // The payment has succeeded.
            checkout()
          }
        } else {
          // The payment has succeeded.
          checkout()
        }
      }
    })

    paymentRequest.on('shippingaddresschange', async function (ev: any) {
      if (
        process.env.NODE_ENV === 'test' ||
        process.env.NODE_ENV === 'production'
      ) {
        return axios
          .get(`/addresses/verify/${ev.shippingAddress.postalCode}`)
          .then((res) => {
            if (res.data.valid) {
              ev.updateWith({
                status: 'success',
              })
            } else {
              throw new Error('Postcode not served')
            }
          })
          .catch(() => {
            ev.updateWith({ status: 'invalid_shipping_address' })
          })
      } else {
        ev.updateWith({
          status: 'success',
        })
      }
    })
  }, [paymentRequest, paymentIntent])

  if (paymentRequest && paymentIntent) {
    return <PaymentRequestButtonElement options={{ paymentRequest }} />
  }

  // Use a traditional checkout form.
  return <CheckoutForm checkout={checkout} />
}

const Summary = ({ summary }) => {
  if (!summary) {
    return <div />
  }
  const { couponCode } = React.useContext(FieldsContext)
  const dispatch = React.useContext(DispatchContext)
  const { coupon } = React.useContext(StateContext)

  return (
    <div>
      <CouponCode
        price={summary.total}
        context="checkout"
        setCoupon={(coupon) =>
          dispatch({ type: 'correct-coupon', payload: coupon })
        }
        field={couponCode}
      />
      <Price label="Subtotal" price={summary.subtotal} />
      <Price label="Insurance" price={summary.insurance} />
      <Price label="Shipping" price={summary.shipping} />
      <Price
        negative
        label="Discount"
        price={summary.discount + (coupon?.discount || 0)}
      />
      <div className="h-px bg-pri my-1" />
      <Price
        label="Total"
        price={coupon?.total || summary.total}
        className="font-bold"
      />
    </div>
  )
}

const Price = ({ negative = false, label, price, className = '' }) => (
  <div className={`flex-row justify-between ${className}`}>
    <span>{label}</span>
    <span>
      {negative && '-'} {fmtPrice(price)}
    </span>
  </div>
)

function handleServerResponse(response, stripe, dispatch) {
  if (response.error) {
    // Show error from server on payment form
    dispatch({ type: 'status-error', payload: 'Unable to process payment' })
  } else if (response.status === 'no-charge') {
    dispatch({ type: 'status-success' })
  } else if (response.requires_action) {
    // Use Stripe.js to handle required card action
    stripe
      .handleCardAction(response.payment_intent_client_secret)
      .then((res) => handleStripeJsResult(res, stripe, dispatch))
  } else {
    dispatch({ type: 'status-success' })
  }
}

function handleStripeJsResult(result, stripe, dispatch) {
  if (result.error) {
    dispatch({ type: 'status-error', payload: result.error })
  } else {
    // The card action has been handled
    // The PaymentIntent can be confirmed again on the server
    axios
      .post('/orders/checkout', {
        paymentIntent: result.paymentIntent.id,
      })
      .then((res) => handleServerResponse(res.data, stripe, dispatch))
  }
}

export default CheckoutContextWrapper
