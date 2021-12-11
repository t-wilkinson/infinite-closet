import React from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import axios from '@/utils/axios'
import { Warning, Input, useFields, Submit, Form, UseFormField } from '@/Form'
import { Icon, iconClose, iconCheck } from '@/Icons'
import useSignin from '@/User/useSignin'
import { BlueLink } from '@/components'
import { StrapiUser } from '@/types/models'
import useAnalytics from '@/utils/useAnalytics'
import Popup from '@/Layout/Popup'

export * from './PaymentWrapper'

const toTitleCase = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

const cardStyle = {
  style: {
    base: {
      color: '#000',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#666',
        // color: '#5f6368',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

export const PaymentCard = ({ form, className = '' }) => {
  const onChange = async (event: any) => {
    if (event.error) {
      form.setErrors(event.error.message)
    } else {
      form.clearErrors()
    }
  }

  return (
    <div className={`border my-2 border-gray rounded-sm p-4 ${className}`}>
      <CardElement id="card-element" options={cardStyle} onChange={onChange} />
    </div>
  )
}

export const PaymentMethods = ({ user, state, dispatch }) => {
  return (
    <div className="space-y-4">
      {state.paymentMethods.map((paymentMethod: any) => (
        <PaymentMethod
          key={paymentMethod.id}
          state={state}
          dispatch={dispatch}
          userId={user.id}
          {...paymentMethod}
        />
      ))}
    </div>
  )
}

export const PaymentMethod = ({
  id,
  dispatch,
  userId,
  state,
  card: { brand, exp_month, exp_year, last4 },
}) => {
  const signin = useSignin()

  const removePaymentMethod = () => {
    axios
      .delete<void>(`/account/${userId}/payment-methods/${id}`)
      .then(() => signin())
      .catch((err) => console.error(err))
  }

  return (
    <div className="relative">
      <button
        type="button"
        className={`relative flex border bg-gray-light p-4 flex-row cursor-pointer items-center
      ${id === state.paymentMethod ? 'border-black' : ''}
      `}
        aria-label={`Choose ${toTitleCase(brand)}
      card ending in ${last4} which expires on ${exp_month}/${exp_year}
      `}
        onClick={() => dispatch({ type: 'choose-payment-method', payload: id })}
      >
        <div className="mr-4 w-4 h-4 rounded-full border border-gray items-center justify-center mr-2">
          <div
            className={`w-3 h-3 rounded-full
          ${id === state.paymentMethod ? 'bg-pri' : ''}
          `}
          />
        </div>
        <div className="items-start justify-between">
          <span>
            {toTitleCase(brand)} ending in {last4}
          </span>
          <span>
            Expires {exp_month}/{exp_year}
          </span>
        </div>
      </button>
      <button
        className="absolute top-0 right-0 p-2"
        type="button"
        onClick={removePaymentMethod}
      >
        <Icon icon={iconClose} size={16} />
      </button>
    </div>
  )
}

export const Authorize = ({ field }) => (
  <button
    onClick={() => field.setValue(!field.value)}
    aria-label="Authorize Infinite Closet to handle card details"
    type="button"
    className="flex flex-col"
  >
    <div className="flex flex-row items-center">
      <div className="items-center justify-center w-5 h-5 bg-white border border-black rounded-sm mr-4">
        {field.value && <Icon icon={iconCheck} className="w-3 h-3" />}
      </div>
      <span className="w-full text-left">
        I authorise Infinite Closet to send instructions to the financial
        institution that issued my card to take payments from my card account in
        accordance with the{' '}
        <BlueLink href="/terms-and-conditions" label="terms and conditions" />.
      </span>
    </div>
    <Warning warnings={field.errors} />
  </button>
)

type AddPaymentMethod = {
  user: StrapiUser
  close: () => {}
  choosePaymentMethod: (paymentMethod: any) => {}
  setPaymentMethods: (paymentMethods: any[]) => {}
  form: UseFormField
}

export const AddPaymentMethod = ({
  user,
  close,
  choosePaymentMethod,
  setPaymentMethods,
  form,
}: AddPaymentMethod) => {
  const [clientSecret, setClientSecret] = React.useState(undefined)
  const stripe = useStripe()
  const elements = useElements()
  const analytics = useAnalytics()

  const fields = useFields<{
    authorized: boolean
    billingName: string
  }>({
    authorized: {
      constraints: 'selected',
      default: false,
      errorMessage: 'Please authorise us to use this payment method',
    },
    billingName: {
      label: 'Billing Name',
      constraints: 'required',
      default: [user.firstName, user.lastName].join(' ').trim(),
    },
  })

  React.useEffect(() => {
    if (user) {
      axios
        .post<{ clientSecret: string }>('/account/wallet', {})
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => {
          console.log(err)
        })
    }
  }, [user])

  const onSubmit = (setupIntent: any) => {
    close()
    choosePaymentMethod(setupIntent.payment_method)

    axios
      .get<{ paymentMethods: any[] }>('/account/payment-methods')
      .then((data) => {
        setPaymentMethods(data.paymentMethods)
      })
      .catch((err) => {
        throw err
      })
  }

  const addPaymentMethod = async () => {
    const cleaned = fields.clean()
    try {
      const payload = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: cleaned.billingName || undefined,
            email: user.email || undefined,
            phone: user.phoneNumber || undefined,
          },
        },
      })
      if (payload.error) {
        throw payload.error
      } else {
        analytics.logEvent('add_payment_info', {
          user: user.email,
        })
        onSubmit(payload.setupIntent)
      }
    } catch (e) {
      throw 'Something went wrong... Please try again later'
    }
  }

  return (
    <Popup close={close} header="Add Payment Method">
      <Form
        id="payment-form"
        fields={fields}
        className="w-full max-w-sm w-full bg-white rounded-lg relative"
        onSubmit={addPaymentMethod}
      >
        <Input field={fields.get('billingName')} />
        <PaymentCard form={form} />
        <Authorize field={fields.get('authorized')} />
        <Submit className="w-full" field={fields.form} />
      </Form>
    </Popup>
  )
}
