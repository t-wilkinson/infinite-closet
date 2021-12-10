import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useRouter } from 'next/router'
import { CardElement } from '@stripe/react-stripe-js'
dayjs.extend(utc)

import { CartUtils } from '@/Cart/slice'
import { useRegisterUser } from '@/Account/Register'
import { Summary, toContact } from '@/Checkout/Utils'
import { useCheckout, useFetchCart } from '@/Checkout/Utils'
import {
  useFields,
  Warning,
  OR,
  Form,
  Submit,
  Input,
  Coupon,
  Password,
  UseFields,
  UseField,
} from '@/Form'
import { useAddressFields, AddressFields } from '@/Form/Address'
import { PaymentWrapper, cardStyle, Authorize } from '@/Form/Payment'
import { useSelector, useDispatch } from '@/utils/store'
import { BlueLink } from '@/components'
import useAnalytics from '@/utils/useAnalytics'
import PaymentRequestForm from '@/Checkout/PaymentRequestForm'
import Cart from '@/Cart'

const initialState = {
  error: undefined,
  coupon: undefined,
  contact: undefined as { email: string; fullName: string; nickName: string },
  registerError: false,
}
type State = typeof initialState

const reducer = (state: typeof initialState, action: any) => {
  const def = (key: string) => ({ ...state, [key]: action.payload })
  // prettier-ignore
  switch (action.type) {
    case 'select-coupon': return def('coupon')
    case 'set-payment-method': return def('paymentMethod')
    case 'register-error': return {...state,  registerError: true, error: action.payload}
    case 'change-contact': return {...state, contact: action.payload}
    default: return state
  }
}

type Fields = UseFields
const StateContext = React.createContext(null)
const DispatchContext = React.createContext(null)
const FieldsContext = React.createContext<Fields>(null)
const AddressContext = React.createContext<AddressFields>(null)

const CheckoutWrapper = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const rootDispatch = useDispatch()
  const analytics = useAnalytics()
  const cart = useSelector((state) => state.cart.checkoutCart)
  const fields = useFields({
    couponCode: {},
    email: { constraints: 'email required string' },
    billingName: { constraints: 'required string' },
    password: { constraints: 'optional-password' },
    authorized: {
      constraints: 'selected',
      default: false,
      errorMessage: 'Please authorise us to use this payment method',
    },
  })
  const address = useAddressFields()
  const fetchCart = useFetchCart()

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
                <Checkout />
              </PaymentWrapper>
            </AddressContext.Provider>
          </FieldsContext.Provider>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
  )
}

const Checkout = () => {
  const [isVisible, setVisible] = React.useState(false)
  const state = React.useContext(StateContext)
  const dispatch = React.useContext(DispatchContext)
  const fields = React.useContext(FieldsContext)
  const router = useRouter()

  const cartCount = useSelector((state) => state.cart.count)
  const analytics = useAnalytics()
  const fetchCart = useFetchCart()
  const rootDispatch = useDispatch()

  const onCheckout = (contact: State['contact']) => {
    rootDispatch(CartUtils.set([]))
    fetchCart()
    dispatch({ type: 'change-contact', payload: contact })
    analytics.logEvent('purchase', {
      user: 'guest',
      type: 'checkout',
    })
  }

  return (
    <div
      className="w-full justify-center max-w-screen-xl my-4 h-full
      md:flex-row space-y-4 md:space-y-0 md:space-x-4
      "
    >
      {fields.form.value === 'success' ? (
        <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-16 pb-16">
          <span className="font-bold text-xl flex flex-col items-center">
            Thank you for your purchase!
          </span>
          {state.registerError && (
            <div className="my-4">
              <span>We could not create an account for you.</span>
              <Warning warnings={[state.registerError] || []} />
            </div>
          )}
        </div>
      ) : cartCount === 0 ? (
        <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-32">
          <span className="font-bold text-xl flex flex-col items-center">
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
          <PaymentRequestForm
            setVisible={setVisible}
            coupon={state.coupon}
            form={fields.form}
            onCheckout={() => {
              fetchCart()
              analytics.logEvent('purchase', {
                user: 'guest',
                type: 'checkout',
              })
              router.push('/checkout/thankyou')
            }}
            couponCode={fields.get('couponCode').clean() as string}
          />
          {isVisible && <OR />}
          <CheckoutForm onCheckout={onCheckout} />
        </div>
      )}
    </div>
  )
}

const CheckoutForm = ({ onCheckout }) => {
  const state = React.useContext(StateContext)
  const fields = React.useContext(FieldsContext)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const address = React.useContext(AddressContext)
  const dispatch = React.useContext(DispatchContext)
  const checkout = useCheckout(fields.form)
  const registerUser = useRegisterUser()

  const onSubmit = async () => {
    const cleanedFields = fields.clean()
    const cleanedAddress = address.clean()
    const contact = toContact({
      email: cleanedFields.email,
      address: cleanedAddress,
    })

    await checkout({
      address: cleanedAddress,
      billing: {
        name: cleanedFields.billingName,
      },
      email: cleanedFields.email,
      couponCode: cleanedFields.couponCode,
    })
    await onCheckout({ contact })

    if (cleanedFields.password) {
      await registerUser({
        email: contact.email,
        firstName: contact.fullName.split(' ')[0],
        lastName: contact.fullName.split(' ').slice(1).join(' '),
        password: cleanedFields.password,
      })
    }
    fields.get('couponCode').setValue(null)
  }

  return (
    <div className="py-8 -mx-4 px-4 sm:mx-0 sm:px-0 bg-white items-center ">
      <Form
        onSubmit={onSubmit}
        fields={[fields, address]}
        className="max-w-screen-sm space-y-8"
        redirect="/checkout/thankyou"
      >
        <SideItem label="Address">
          <Address address={address} email={fields.get('email')} />
        </SideItem>
        <SideItem label="Payment Method">
          <Input field={fields.get('billingName')} />
          <Payment fields={fields} />
        </SideItem>
        <SideItem label="Summary">
          <Summary
            summary={summary}
            couponCode={fields.get('couponCode')}
            setCoupon={(coupon: Coupon) => {
              dispatch({ type: 'select-coupon', payload: coupon })
            }}
            coupon={state.coupon}
          />
        </SideItem>
        <div className="p-8 bg-gray-light">
          <span className="font-bold text-lg mb-3">
            Checkout faster next time with an Infinite Closet account.
          </span>
          <Password field={fields.get('password')} />
        </div>
        <div className="mt-4 w-full">
          <Submit field={fields.form} disabled={cart.every(isOrderInvalid)}>
            {cart.every(isOrderInvalid)
              ? 'No Available Items'
              : cart.some(isOrderInvalid)
              ? 'Checkout Available Items'
              : 'Secure Checkout'}
          </Submit>
        </div>
      </Form>
    </div>
  )
}

const isOrderInvalid = (order: { valid: boolean }) => !order.valid

const SideItem = ({ label, children }) => (
  <div>
    <span className="font-bold text-lg">
      {label}
      <div className="w-full h-px bg-pri mt-2 mb-2" />
    </span>
    {children}
  </div>
)

const Address = ({
  email,
  address,
}: {
  email: UseField<string>
  address: AddressFields
}) => {
  return (
    <div className="grid grid-flow-row grid-cols-2 w-full gap-y-3 gap-x-4 pt-2">
      <Input field={email} />
      {address.map((field) => (
        <Input key={field.name} field={field} />
      ))}
    </div>
  )
}

const Payment = ({ fields }: { fields: Fields }) => {
  const handleChange = async (event: any) => {
    if (event.error) {
      fields.form.setErrors(event.error.message)
    } else {
      fields.form.setErrors()
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
      <Authorize field={fields.get('authorized')} />
    </>
  )
}

export default CheckoutWrapper
