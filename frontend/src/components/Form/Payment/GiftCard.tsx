import React from 'react'
import Link from 'next/link'

import { toFullname } from '@/utils/helpers'
import dayjs, { createDateFormat } from '@/utils/dayjs'
import { Dayjs } from '@/types'
import axios from '@/utils/axios'
import {
  Input,
  Textarea,
  Form,
  Submit,
  Fieldset,
  UseFields,
  BodyWrapper,
  useFields,
} from '@/Form'
import { Button } from '@/Components'
import { StrapiGiftCard } from '@/types/models'
import { useSelector } from '@/utils/store'
import { PaymentSubText } from '@/Order/Checkout/Utils'
import { Icon, iconDate } from '@/Components/Icons'

import { MoneyAmounts } from './Money'
import { PaymentElement, usePaymentElement } from './PaymentElement'
import { PaymentWrapper } from './PaymentWrapper'

const createGiftCard = (data: any) => axios.post('/giftcards', data)

const updateGiftCardValue = ({ paymentIntent, value }) =>
  axios.put(
    `/giftcards/payment-intent/${paymentIntent}`,
    { value },
    { withCredentials: false }
  )

interface GiftCardFields {
  value: number
  recipientName: string
  recipientEmail: string
  confirmRecipientEmail: string
  senderName: string
  senderEmail: string
  message: string
  currentPage: 'info' | 'payment'
  deliveryDate: Dayjs
  dateSelectorVisible: boolean
  paymentStatus: null
}

const values = [10, 25, 50]

export const useGiftCardFields = ({ user = null } = {}) =>
  useFields<GiftCardFields>({
    value: { constraints: 'min:0 number', default: values[0] },
    currentPage: { default: 'info' },
    paymentStatus: { default: null },
    recipientName: {
      constraints: 'required',
      label: 'Recipients Name',
      autocomplete: 'none',
    },
    recipientEmail: {
      constraints: 'required email',
      label: 'Recipients Email',
      autocomplete: 'none',
    },
    confirmRecipientEmail: {
      constraints: 'required',
      label: 'Confirm Recipients Email',
    },
    senderName: {
      default: toFullname(user),
      constraints: 'required',
      label: 'Senders Name',
    },
    senderEmail: {
      default: user?.email,
      constraints: 'required email',
      label: 'Senders Email',
    },
    message: {
      placeholder: 'Write your message here',
    },
    deliveryDate: { constraints: 'required', default: dayjs() },
    dateSelectorVisible: {},
  })

const toFormData = (object: object) =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key])
    return formData
  }, new FormData())

const GiftCardContent = ({ fields }: { fields: UseFields<GiftCardFields> }) => {
  const payment = usePaymentElement({fields})
  const [giftcard, setGiftcard] = React.useState<StrapiGiftCard>(null)
  const user = useSelector((state) => state.user.data)

  const onSubmit = React.useCallback(async () => {
    throw 'Sorry, we are not accepting payments at the moment.'
    // const cleaned = fields.clean()
    // if (cleaned.recipientEmail !== cleaned.confirmRecipientEmail) {
    //   fields.get('confirmRecipientEmail').setError('Confirm email must match')
    //   throw 'Confirm email must match'
    // }
    // await payment.handleSubmit({
    //   formData: toFormData({
    //     ...cleaned,
    //     deliveryDate: cleaned.deliveryDate.toJSON(),
    //   }),
    // })
  }, [fields.status])

  React.useEffect(() => {
    payment.on('success', (data) => {
      createGiftCard(data).then((giftCard) => {
        setGiftcard(giftCard)
        fields.setStatus('success')
      })
    })
  }, [])

  React.useEffect(() => {
    if (user) {
      fields.setValue('senderName', toFullname(user))
      fields.setValue('senderEmail', user.email)
    }
  }, [user])

  if (fields.status === 'success' && giftcard) {
    return <BodyWrapper label={`Thank you for your purchase`} />
  }

  return (
    <Form onSubmit={onSubmit} fields={fields} className="w-full">
      {process.env.NODE_ENV === 'development' && (
        <button type="button" onClick={() => fields.setStatus(null)}>
          reset
        </button>
      )}
      <GiftCardInfo fields={fields} />
      <GiftCardPayment fields={fields} />
    </Form>
  )
}

const GiftCardInfo = ({ fields }) => {
  const fmtDate = createDateFormat('ddd M/D', { 'en-gb': 'ddd D/M' })
  const nextPage = () => {
    const errors = fields.getErrors()
    delete errors.value
    const hasErrors = fields.hasErrors(errors)
    fields.attachErrors(errors)
    if (hasErrors) {
      return
    }
    fields.setValue('currentPage', 'payment')
  }

  return (
    <div
      className={`space-y-8 ${
        fields.value('currentPage') === 'payment' ? 'hidden' : ''
      }`}
    >
      <b className="text-center">
        <i>
          Emailed to the recipient at 7am on a specified date.
          <br />
          If you would like to send immediately, select today's date.
        </i>
      </b>

      <Fieldset label="Delivery date">
        <button
          aria-label="Date selector"
          type="button"
          className="flex flex-grow border border-gray py-2 px-2 rounded-sm rounded-sm flex-row flex-grow justify-between items-center"
          onClick={() => fields.setValue('dateSelectorVisible', true)}
        >
          <span>
            {fields.value('deliveryDate') &&
              fmtDate(fields.value('deliveryDate'))}
          </span>
          <Icon className="text-gray" icon={iconDate} size={24} />
        </button>
      </Fieldset>

      <Fieldset label="To:" className="space-y-3">
        <Input field={fields.get('recipientName')} />
        <Input field={fields.get('recipientEmail')} />
        <Input field={fields.get('confirmRecipientEmail')} />
      </Fieldset>
      <Fieldset label="From:" className="space-y-3">
        <Input field={fields.get('senderName')} />
        <Input field={fields.get('senderEmail')} />
        <Textarea field={fields.get('message')} rows={4} />
      </Fieldset>
      <div>
        <Button onClick={nextPage}>Proceed to Checkout</Button>
        <span>
          <Link href="/terms-and-conditions">
            <a className="underline">Terms and Conditions:</a>
          </Link>{' '}
          Gift cards must be used within 1 year of delivery date
        </span>
        <div className="h-2" />
        <PaymentSubText />
      </div>
    </div>
  )
}

const GiftCardPayment = ({ fields }) => {
  return (
    <div className={fields.value('currentPage') === 'info' ? 'hidden' : ''}>
      <Fieldset label="Amount">
        <MoneyAmounts field={fields.get('value')} amounts={values} />
      </Fieldset>
      <Fieldset label="Billing">
        <PaymentElement id="payment-element" />
      </Fieldset>
      <div className="flex-row w-full space-x-2 mt-6 mb-2">
        <Submit className="w-full" form={fields.form}>
          Secure Checkout
        </Submit>
        <Button
          role="secondary"
          onClick={() => fields.setValue('currentPage', 'info')}
        >
          Back
        </Button>
      </div>
      <PaymentSubText />
    </div>
  )
}

export const GiftCard = ({ paymentIntent: paymentIntent_, fields }) => {
  const clientSecret: string = paymentIntent_?.client_secret
  const [paymentIntent, setPaymentIntent] = React.useState(paymentIntent_)

  React.useEffect(() => {
    const value = fields.value('value')
    if (isNaN(value) || value <= 0) {
      return
    }

    updateGiftCardValue({ paymentIntent: paymentIntent.id, value })
      .then((paymentIntent: any) => {
        setPaymentIntent(paymentIntent)
      })
      .catch(() => {
        fields.setStatus('error')
        fields.setError('An unexpected error occured.')
      })
  }, [fields.value('value')])

  return (
    <PaymentWrapper clientSecret={clientSecret}>
      <GiftCardContent fields={fields} />
    </PaymentWrapper>
  )
}
