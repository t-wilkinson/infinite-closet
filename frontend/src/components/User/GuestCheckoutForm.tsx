import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { CardElement } from '@stripe/react-stripe-js'
dayjs.extend(utc)

import { useSelector } from '@/utils/store'
import { Submit, Input } from '@/Form'
import { cleanFields, isValid } from '@/Form/useFields'
import { cardStyle, Authorise } from '@/User/Payment'
import { Summary } from './CheckoutUtils'

import {
  useCheckout,
  DispatchContext,
  StateContext,
  FieldsContext,
  AddressContext,
} from './GuestCheckoutUtils'

export const CheckoutForm = () => {
  const state = React.useContext(StateContext)
  const fields = React.useContext(FieldsContext)
  const cart = useSelector((state) => state.cart.checkoutCart)
  const summary = useSelector((state) => state.cart.checkoutSummary)
  const address = React.useContext(AddressContext)
  const checkout = useCheckout()
  const dispatch = React.useContext(DispatchContext)

  const onSubmit = () => {
    const cleanedFields = cleanFields(fields)
    const cleanedAddress = cleanFields(address)
    checkout({
      address: cleanedAddress,
      billing: {
        name: cleanedFields.billingName,
      },
      email: cleanedFields.email,
      couponCode: cleanedFields.couponCode,
    })
  }

  return (
    <div className="py-8 -mx-4 px-4 sm:mx-0 sm:px-0 bg-white items-center ">
      <div className="max-w-screen-sm space-y-8">
        <SideItem label="Address">
          <Address address={address} email={fields.email} />
        </SideItem>
        <SideItem label="Payment Method">
          <Input {...fields.billingName} />
          <Payment />
        </SideItem>
        <SideItem label="Summary">
          <Summary
            summary={summary}
            couponCode={fields.couponCode}
            dispatch={dispatch}
            coupon={state.coupon}
          />
        </SideItem>
        <div className="mt-4 w-full">
          <Submit
            onSubmit={onSubmit}
            disabled={
              !state.authorised ||
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

export default CheckoutForm
