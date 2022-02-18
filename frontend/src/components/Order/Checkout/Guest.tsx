import React from 'react'
import { useRouter } from 'next/router'

import { Summary } from '@/types'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

import { OrderUtils } from '@/Order'
import { useRegisterUser } from '@/Form/Register'
import {
  useFields,
  Warning,
  OR,
  Form,
  Submit,
  Input,
  Password,
  UseFields,
  BodyWrapper,
} from '@/Form'
import { useAddressFields, AddressFields } from '@/Form/Address'
import {
  PaymentWrapper,
  Authorize,
  PaymentCard,
  PaymentRequestForm,
} from '@/Form/Payment'
import { BlueLink, Divider } from '@/Components'

import { Cart } from '@/Order/Cart'
import { Favorites } from '@/Order/Favorite'

import {
  CheckoutSummary,
  toContact,
  useGuestCheckout,
  useFetchCart,
  isOrderInvalid,
  PaymentSubText,
  onPurchaseEvent,
} from './Utils'

const initialState = {
  error: undefined,
  summary: undefined,
  contact: undefined as { email: string; fullName: string; nickName: string },
  registerError: false,
}
type State = typeof initialState

const reducer = (state: typeof initialState, action: any) => {
  const def = (key: string) => ({ ...state, [key]: action.payload })
  // prettier-ignore
  switch (action.type) {
    case 'add-summary': return def('summary')
    case 'set-payment-method': return def('paymentMethod')
    case 'register-error': return {...state,  registerError: true, error: action.payload}
    case 'change-contact': return {...state, contact: action.payload}
    default: return state
  }
}

type Fields = {
  discountCode: string
  email: string
  billingName: string
  password: string
  authorized: boolean
}
const StateContext = React.createContext(null)
const DispatchContext = React.createContext(null)
const FieldsContext = React.createContext<UseFields<Fields>>(null)
const AddressContext = React.createContext<UseFields<AddressFields>>(null)

const CheckoutWrapper = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const rootDispatch = useDispatch()
  const analytics = useAnalytics()
  const cart = useSelector((state) => state.orders.checkoutCart)
  const fields = useFields<Fields>({
    discountCode: { autocomplete: 'none' },
    email: { constraints: 'email required string' },
    billingName: { constraints: 'required string' },
    password: { constraints: 'optional-password', autocomplete: 'none' },
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
    rootDispatch(OrderUtils.summary())
  }, [cart])

  React.useEffect(() => {
    fetchCart()
  }, [])

  return (
    <div className="w-full flex-grow items-center px-4 pt-4">
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <FieldsContext.Provider value={fields}>
            <AddressContext.Provider value={address}>
              <PaymentWrapper>
                <div
                  className="w-full justify-center max-w-screen-md p-4 my-4 h-full
                  space-y-4 md:space-y-0 md:space-x-4
                  "
                >
                  <Checkout />
                  <Favorites />
                </div>
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

  const cartCount = useSelector((state) => state.orders.count)
  const analytics = useAnalytics()
  const fetchCart = useFetchCart()
  const rootDispatch = useDispatch()

  const onCheckout = (contact: State['contact']) => {
    rootDispatch(OrderUtils.set([]))
    fetchCart()
    dispatch({ type: 'change-contact', payload: contact })
    analytics.logEvent('purchase', {
      user: 'guest',
      type: 'checkout',
    })
  }

  if (fields.form.value === 'success') {
    return (
      <BodyWrapper
        label={
          <>
            Thank you for your purchase!
            {state.registerError && (
              <div className="mt-16 text-base font-normal">
                <span>We were unable to create an account for you.</span>
                <Warning warnings={[state.registerError] || []} />
              </div>
            )}
          </>
        }
      />
    )
  } else if (cartCount === 0) {
    return (
      <BodyWrapper
        label={
          <BlueLink
            href="/products/clothing"
            label="Would you like to browse our collection?"
          />
        }
      />
    )
  } else {
    return (
      <section className="w-full space-y-4">
        <span className="font-subheader uppercase text-3xl">
          SHOPPING CART ({cartCount})
        </span>
        <Divider />
        <div className="h-2" />
        <Cart />
        <PaymentRequestForm
          setVisible={setVisible}
          accurateSummary={state.summary}
          form={fields.form}
          onCheckout={({checkout}) => {
            fetchCart()
            onPurchaseEvent({
              analytics,
              summary: state.summary,
              checkout,
            })
            router.push('/buy/thankyou')
          }}
          discountCode={fields.get('discountCode').clean() as string}
        />
        {isVisible && <OR />}
        <div className="py-8 -mx-4 px-4 sm:mx-0 sm:px-0 bg-white items-center ">
          <CheckoutForm onCheckout={onCheckout} />
        </div>
      </section>
    )
  }
}

const CheckoutForm = ({ onCheckout }) => {
  const state = React.useContext(StateContext)
  const fields = React.useContext(FieldsContext)
  const cart = useSelector((state) => state.orders.checkoutCart)
  const summary = useSelector((state) => state.orders.checkoutSummary)
  const address = React.useContext(AddressContext)
  const dispatch = React.useContext(DispatchContext)
  const checkout = useGuestCheckout()
  const registerUser = useRegisterUser()

  const onSubmit = async () => {
    const cleanedFields = fields.clean()
    const cleanedAddress = address.clean()
    const contact = toContact({
      email: cleanedFields.email,
      address: cleanedAddress,
    })

    await checkout({
      form: fields.form,
      address: cleanedAddress,
      billing: {
        name: cleanedFields.billingName,
      },
      email: cleanedFields.email,
      discountCode: cleanedFields.discountCode,
      summary: state.summary,
    })
    await onCheckout({ contact })

    if (cleanedFields.password) {
      await registerUser({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        password: cleanedFields.password,
      })
    }
    fields.get('discountCode').setValue(null)
  }

  return (
    <Form
      onSubmit={onSubmit}
      fields={[fields, address]}
      className="w-full space-y-8"
      redirect="/buy/thankyou"
      notify
    >
      <SideItem label="Address">
        <div className="grid grid-flow-row grid-cols-2 w-full gap-y-3 gap-x-4 pt-2">
          <Input field={fields.get('email')} />
          {address.map((field) => (
            <Input key={field.name} field={field} />
          ))}
        </div>
      </SideItem>
      <SideItem label="Payment Method">
        <Input field={fields.get('billingName')} />
        <PaymentCard form={fields.form} />
        <Authorize field={fields.get('authorized')} />
      </SideItem>
      <SideItem label="Summary">
        <CheckoutSummary
          summary={summary}
          setAccurateSummary={(summary: Summary) => {
            dispatch({ type: 'add-summary', payload: summary })
          }}
          accurateSummary={state.summary}
          discountCode={fields.get('discountCode') as any}
        />
      </SideItem>
      <div className="p-8 bg-gray-light">
        <span className="font-bold text-lg mb-3">
          Checkout faster next time with an Infinite Closet account.
        </span>
        <Password field={fields.get('password')} />
      </div>
      <div className="mt-4 w-full">
        <Submit
          form={fields.form}
          disabled={
            cart.every(isOrderInvalid) || fields.form.value === 'success'
          }
        >
          {cart.every(isOrderInvalid)
            ? 'No Available Items'
            : cart.some(isOrderInvalid)
            ? 'Checkout Available Items'
            : 'Secure Checkout'}
        </Submit>
        <PaymentSubText />
      </div>
    </Form>
  )
}

const SideItem = ({ label, children }) => (
  <section className="flex flex-col">
    <h3 className="font-bold text-lg">
      {label}
      <div className="w-full h-px bg-pri mt-2 mb-2" />
    </h3>
    {children}
  </section>
)

export default CheckoutWrapper
