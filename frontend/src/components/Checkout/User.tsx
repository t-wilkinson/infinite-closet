import React from 'react'
import { useRouter } from 'next/router'

import axios from '@/utils/axios'
import Cart from '@/Cart'
import { CartUtils } from '@/Cart/slice'
import { Summary } from '@/types'
import { useFields, OR, UseFields, Form, Submit, BodyWrapper } from '@/Form'
import { Addresses, AddAddress } from '@/Form/Address'
import {
  PaymentWrapper,
  PaymentMethods,
  AddPaymentMethod,
} from '@/Form/Payment'
import Popup from '@/Layout/Popup'
import { BlueLink, Button, Divider } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import Carousel from '@/Layout/Carousel'
import { Favorite } from '@/User/Favorites'

import {
  PaymentSubText,
  isOrderInvalid,
  CheckoutSummary,
  useFetchCart,
} from './Utils'
import PaymentRequestForm from './PaymentRequestForm'

type Popup = 'none' | 'address' | 'payment'

const initialState = {
  paymentMethod: undefined,
  paymentMethods: [],
  address: undefined,
  addresses: [],
  popup: 'none' as Popup,
  error: undefined,
  summary: undefined,
}

const reducer = (state: typeof initialState, action: any) => {
  const def = (key: string) => ({ ...state, [key]: action.payload })
  // prettier-ignore
  switch (action.type) {
    case 'add-summary': return def('summary')

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

type Fields = {
  discountCode: string
}
const StateContext = React.createContext(null)
const DispatchContext = React.createContext(null)
const FieldsContext = React.createContext<UseFields<Fields>>(null)

export const CheckoutWrapper = ({}) => {
  const user = useSelector((state) => state.user.data)
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const cart = useSelector((state) => state.cart.checkoutCart)

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const rootDispatch = useDispatch()
  const analytics = useAnalytics()
  const fields = useFields<Fields>({
    discountCode: { autocomplete: 'none' },
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
    rootDispatch(CartUtils.favorites())
  }, [user])

  React.useEffect(() => {
    fetchCart()

    dispatch({
      type: 'set-addresses',
      payload: user.addresses,
    })
    if (user.addresses?.[0]?.id) {
      dispatch({
        type: 'choose-address',
        payload: user.addresses[0].id,
      })
    }

    axios
      .get<any>('/account/payment-methods')
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
    <div className="w-full flex-grow items-center px-4 pt-4">
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <FieldsContext.Provider value={fields}>
            <PaymentWrapper>
              <section
                className="w-full justify-center max-w-screen-xl my-4 h-full
                md:flex-row space-y-4 md:space-y-0 md:space-x-4
                "
              >
                <Checkout fetchCart={fetchCart} analytics={analytics} />
                <SideBar
                  user={user}
                  state={state}
                  summary={summary}
                  fields={fields}
                  dispatch={dispatch}
                />
                <div className="md:hidden">
                  <Favorites />
                </div>
              </section>
            </PaymentWrapper>
          </FieldsContext.Provider>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
  )
}

const Checkout = ({ fetchCart, analytics }) => {
  const user = useSelector((state) => state.user.data)
  const cartCount = useSelector((state) => state.cart.count)
  const cart = useSelector((state) => state.cart.checkoutCart)

  const router = useRouter()
  const state = React.useContext(StateContext)
  const fields = React.useContext(FieldsContext)
  const [isVisible, setVisible] = React.useState(false)

  const checkout = async () => {
    const cleanedFields = fields.clean()
    return axios
      .post<void>(`/orders/checkout/${user.id}`, {
        address: state.address,
        paymentMethod: state.paymentMethod,
        orders: cart.map((item) => item.order),
        discountCode: cleanedFields.discountCode,
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

  if (cartCount === 0) {
    return (
      <div
        style={{
          flex: '4 1 0'
        }}
      >
      <BodyWrapper
        label={
          <BlueLink
            href="/products/clothing"
            label="Would you like to browse our collection?"
          />
        }
      />
        <div className="hidden md:block">
          <Favorites />
        </div>
      </div>
    )
  } else {
    return (
      <div
        className="space-y-4"
        style={{
          flex: '4 1 0',
        }}
      >
        <h1 className="font-subheader uppercase text-3xl">
          SHOPPING CART ({cartCount})
        </h1>
        <Divider />
        <div className="h-2" />
        <Cart />
        <Form
          className="w-full space-y-4"
          fields={fields}
          onSubmit={checkout}
          redirect="/buy/thankyou"
          notify
        >
          <Submit
            form={fields.form}
            disabled={
              !(state.paymentMethod && state.address) ||
              fields.form.value === 'success' ||
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
          <PaymentSubText />
          {isVisible && <OR />}
          <PaymentRequestForm
            setVisible={setVisible}
            discountCode={fields.get('discountCode').clean()}
            accurateSummary={state.summary}
            form={fields.form}
            onCheckout={() => {
              fetchCart()
              analytics.logEvent('purchase', {
                user: user?.email,
                type: 'checkout',
              })
              router.push('/buy/thankyou')
            }}
          />
        </Form>
        <div className="hidden md:block">
          <Favorites />
        </div>
      </div>
    )
  }
}

const Favorites = ({}) => {
  const favorites = useSelector((state) => state.cart.favorites)
  const ref = React.useRef(null)
  const [width, setWidth] = React.useState(window.innerWidth)
  React.useEffect(() => {
    const onResize = () => {
      const clientWidth = ref.current?.clientWidth
      if (clientWidth) {
        setWidth(clientWidth)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (favorites?.length === 0) {
    return null
  }

  return (
    <section
      className="pt-12"
      ref={ref}
      style={{
        flex: '1 0 auto',
      }}
    >
      <h3 className="font-subheader text-2xl">Favourites</h3>
      <Divider />
      <div className="h-8" />
      <Carousel
        pageSize={width < 470 ? 1 : width < 610 ? 2 : 3}
        Renderer={Favorite}
        riders={favorites}
        map={(favorite) => ({ order: favorite })}
        inner={{
          style: {
            flex: '1 0 auto',
          },
        }}
      />
    </section>
  )
}

const SideBar = ({ user, state, summary, fields, dispatch }) => (
  <aside
    className="space-y-4"
    style={{
      flex: '1 0 16rem',
    }}
  >
    <SideItem label="Summary" user={user}>
      <CheckoutSummary
        userId={user.id}
        summary={summary}
        discountCode={fields.get('discountCode')}
        accurateSummary={state.summary}
        setAccurateSummary={(summary: Summary) =>
          dispatch({ type: 'add-summary', payload: summary })
        }
      />
    </SideItem>
    <SideItem label="Payment Method" user={user} protect>
      <Payment
        form={fields.form}
        user={user}
        state={state}
        dispatch={dispatch}
      />
    </SideItem>
    <SideItem label="Address" user={user} protect>
      <Address user={user} state={state} dispatch={dispatch} />
    </SideItem>
  </aside>
)

const SideItem = ({ label, children, user, protect = false }) =>
  protect && !user ? null : (
    <section className="space-y-2 bg-white p-3 rounded-sm relative">
      <h3 className="font-bold text-lg my-2">
        {label}
        <div className="w-full h-px bg-pri mt-2 -mb-2" />
      </h3>
      {children}
    </section>
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
      <Popup
        isOpen={state.popup === 'address'}
        header="Add Address"
        close={() => dispatch({ type: 'close-popup' })}
      >
        <AddAddress
          user={user}
          onSubmit={() => dispatch({ type: 'close-popup' })}
        />
      </Popup>
    )}
    <div className="h-0" />
    <Button role="secondary" onClick={() => dispatch({ type: 'edit-address' })}>
      Add New Address
    </Button>
  </>
)

const Payment = ({ form, state, user, dispatch }) => (
  <>
    <PaymentMethods user={user} dispatch={dispatch} state={state} />
    {state.popup === 'payment' && (
      <AddPaymentMethod
        user={user}
        form={form}
        close={() => dispatch({ type: 'close-popup' })}
        choosePaymentMethod={(paymentMethod) =>
          dispatch({
            type: 'choose-payment-method',
            payload: paymentMethod,
          })
        }
        setPaymentMethods={(paymentMethods) =>
          dispatch({
            type: 'set-payment-methods',
            payload: paymentMethods,
          })
        }
      />
    )}
    <Button role="secondary" onClick={() => dispatch({ type: 'edit-payment' })}>
      Add New Payment Method
    </Button>
  </>
)

export default CheckoutWrapper
