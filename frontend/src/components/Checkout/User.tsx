import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import axios from '@/utils/axios'
import Cart from '@/Cart'
import { CartItem } from '@/Cart/types'
import { CartUtils } from '@/Cart/slice'
import { useFields, OR, Coupon, UseFields, Form, Submit } from '@/Form'
import { Addresses, AddAddress } from '@/Form/Address'
import {
  PaymentWrapper,
  PaymentMethods,
  AddPaymentMethodFormWrapper,
} from '@/Form/Payment'
import { Icon, iconClose } from '@/Icons'
import { BlueLink } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

import { Summary, useFetchCart } from './Utils'
import PaymentRequestForm from './PaymentRequestForm'

type Popup = 'none' | 'address' | 'payment'

const initialState = {
  paymentMethod: undefined,
  paymentMethods: [],
  address: undefined,
  addresses: [],
  popup: 'none' as Popup,
  error: undefined,
  coupon: undefined,
}

const reducer = (state: typeof initialState, action: any) => {
  const def = (key: string) => ({ ...state, [key]: action.payload })
  // prettier-ignore
  switch (action.type) {
    case 'select-coupon': return def('coupon')

    case 'edit-payment': return { ...state, popup: 'payment' }
    case 'edit-address': return { ...state, popup: 'address' }
    case 'close-popup': return { ...state, popup: 'none' }

    case 'choose-address': return def('address')
    case 'set-addresses': return def('addresses')

    case 'choose-payment-method': return { ...state, paymentMethod: action.payload }
    case 'add-payment-method': return { ...state, paymentMethods: [...state.paymentMethods, action.payload], }
    case 'set-payment-methods': return { ...state, paymentMethods: action.payload, }
    case 'remove-payment-method': {
      const paymentMethods = [...state.paymentMethods].splice(action.payload, 1)
      return { ...state, paymentMethods }
    }

    case 'payment-error': return { ...state, paymentStatus: 'disabled', error: action.payload }
    case 'payment-succeeded': return { ...state, paymentStatus: action.payload ?? 'succeeded', error: null, }
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
const FieldsContext = React.createContext<
  UseFields<{
    couponCode: string
  }>
>(null)

export const CheckoutWrapper = ({}) => {
  const user = useSelector((state) => state.user.data)
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const rootDispatch = useDispatch()
  const analytics = useAnalytics()
  const cart = useSelector((state) => state.cart.checkoutCart)
  const fields = useFields({
    couponCode: { autocomplete: 'off' },
  })
  const fetchCart = useFetchCart()

  React.useEffect(() => {
    analytics.logEvent('view_cart', {
      user: user.email,
    })
  }, [])

  React.useEffect(() => {
    rootDispatch(CartUtils.summary())
  }, [cart])

  React.useEffect(() => {
    fetchCart()

    dispatch({
      type: 'set-addresses',
      payload: user.addresses,
    })
    if (user.addresses && user.addresses[0] && user.addresses[0].id) {
      dispatch({
        type: 'choose-address',
        payload: user.addresses[0].id,
      })
    }

    axios.get<any>('/account/payment-methods')
      .then((data) => {
        dispatch({
          type: 'set-payment-methods',
          payload: data.paymentMethods,
        })
        if (data.paymentMethods?.[0]?.id) {
          dispatch({
            type: 'choose-payment-method',
            payload: data.paymentMethods[0].id,
          })
        }
      })
      .catch((err) => console.error(err))
  }, [user])

  return (
    <div className="w-full flex-grow items-center bg-gray-light px-4 pt-4">
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <FieldsContext.Provider value={fields}>
            <PaymentWrapper>
              <Checkout fetchCart={fetchCart} analytics={analytics} />
            </PaymentWrapper>
          </FieldsContext.Provider>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
  )
}

const Checkout = ({ fetchCart, analytics }) => {
  const dispatch = React.useContext(DispatchContext)
  const state = React.useContext(StateContext)
  const fields = React.useContext(FieldsContext)
  const cartCount = useSelector((state) => state.cart.count)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const user = useSelector((state) => state.user.data)
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const [isVisible, setVisible] = React.useState(false)

  const checkout = async () => {
    const cleanedFields = fields.clean()
    return axios
      .post<void>(`/orders/checkout/${user.id}`, {
        contact: {
          fullName: `${user.firstName} ${user.lastName}`,
          nickName: user.firstName,
          email: user.email,
        },
        address: state.address,
        paymentMethod: state.paymentMethod,
        orders: cart.map((item) => item.order),
        couponCode: cleanedFields.couponCode,
      })
      .then(() => {
        fetchCart()
        analytics.logEvent('purchase', {
          user: user?.email,
          type: 'checkout',
        })
      })
      .catch(() => {
        throw 'Unable to process order, please try again later'
      })
  }

  const Wrapper = ({ children }) => (
    <div className="w-full items-center h-full justify-start bg-white rounded-sm pt-32">
      <span className="font-bold text-xl flex flex-col items-center">
        {children}
      </span>
    </div>
  )

  return (
    <div
      className="w-full justify-center max-w-screen-xl my-4 h-full
      md:flex-row space-y-4 md:space-y-0 md:space-x-4
      "
    >
      <div className="md:w-2/5 space-y-4">
        <SideItem label="Addresses" user={user} protect>
          <Address user={user} state={state} dispatch={dispatch} />
        </SideItem>
        <SideItem label="Payment Methods" user={user} protect>
          <Payment user={user} state={state} dispatch={dispatch} />
        </SideItem>
        <SideItem label="Summary" user={user}>
          <Summary
            userId={user.id}
            summary={summary}
            couponCode={fields.get('couponCode')}
            setCoupon={(coupon: Coupon) =>
              dispatch({ type: 'select-coupon', payload: coupon })
            }
            coupon={state.coupon}
          />
        </SideItem>
      </div>
      {fields.form.value === 'success' ? (
        <Wrapper>Thank you for your purchase!</Wrapper>
      ) : cartCount === 0 ? (
        <Wrapper>
          <div>
            <BlueLink
              href="/products/clothing"
              label="Would you like to browse our collection?"
            />
          </div>
        </Wrapper>
      ) : (
        <Form className="w-full space-y-4" fields={fields} onSubmit={checkout}>
          <Cart />
          <PaymentRequestForm
            setVisible={setVisible}
            couponCode={fields.get('couponCode').clean()}
            coupon={state.coupon}
            form={fields.form}
            onCheckout={() => {
              fetchCart()
              analytics.logEvent('purchase', {
                user: user?.email,
                type: 'checkout',
              })
            }}
          />
          {isVisible && <OR />}
          <Submit
            field={fields.form}
            disabled={
              !(state.paymentMethod && state.address) ||
              ['checking-out'].includes(state.status) ||
              cart.every(isOrderInvalid)
            }
          >
            {!state.address
              ? 'Please Select an Address'
              : !state.paymentMethod
              ? 'Please Select a Payment Method'
              : cart.every(isOrderInvalid)
              ? 'No Available Items'
              : cart.some(isOrderInvalid)
              ? 'Checkout Available Items'
              : 'Secure Checkout'}
          </Submit>
        </Form>
      )}
    </div>
  )
}

const isOrderInvalid = (order: CartItem) => !order.valid

const SideItem = ({ label, children, user, protect = false }) =>
  protect && !user ? null : (
    <div className="space-y-2 bg-white p-3 rounded-sm relative">
      <span className="font-bold text-lg my-2">
        {label}
        <div className="w-full h-px bg-pri mt-2 -mb-2" />
      </span>
      {children}
    </div>
  )

const Address = ({ state, user, dispatch }) => (
  <>
    <Addresses
      userId={user.id}
      addresses={user.addresses}
      state={state}
      select={(id: number) => dispatch({ type: 'choose-address', payload: id })}
    />
    {state.popup === 'address' && (
      <div className="fixed inset-0 z-30 bg-black bg-opacity-50 items-center justify-center">
        <div className="w-full max-w-md w-full p-6 bg-white rounded-lg relative">
          <div className="w-full items-center">
            <span className="font-bold text-3xl mt-2">Add Address</span>
          </div>

          <div className="w-full h-px bg-pri mb-6 mt-1 rounded-full" />

          <button
            className="absolute top-0 right-0 m-3"
            type="button"
            onClick={() => dispatch({ type: 'close-popup' })}
          >
            <Icon icon={iconClose} size={20} />
          </button>
          <AddAddress
            user={user}
            onSubmit={() => dispatch({ type: 'close-popup' })}
          />
        </div>
      </div>
    )}
    <div className="h-0" />
    <button
      className="flex p-2 bg-white rounded-sm border border-gray justify-center"
      onClick={() => dispatch({ type: 'edit-address' })}
    >
      <span className="inline">Add Address</span>
    </button>
  </>
)

const Payment = ({ state, user, dispatch }) => (
  <>
    <PaymentMethods user={user} dispatch={dispatch} state={state} />
    <AddPaymentMethodFormWrapper
      user={user}
      state={state}
      dispatch={dispatch}
    />
    <button
      className="flex p-2 bg-white rounded-sm border border-gray justify-center"
      type="button"
      onClick={() => dispatch({ type: 'edit-payment' })}
    >
      <span className="inline">Add Payment</span>
    </button>
  </>
)

export default CheckoutWrapper
