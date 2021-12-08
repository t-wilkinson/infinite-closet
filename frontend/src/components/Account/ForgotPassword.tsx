import React from 'react'

import axios from '@/utils/axios'
import useAnalytics from '@/utils/useAnalytics'
import { BlueLink } from '@/components'
import {
  useFields,
  UseFields,
  Submit,
  Form,
  Input,
  FormHeader,
  OR,
} from '@/Form'
import { Analytics } from '@/utils/useAnalytics'

type RequestChangePasswordFields = UseFields<{
  email: string
}>

export const requestChangePassword = async (
  fields: RequestChangePasswordFields,
  analytics: Analytics
) => {
  const cleaned = fields.clean()
  return await axios
    .post<void>('/auth/forgot-password', { email: cleaned.email }, {withCredentials: false})
    .then(() =>
      analytics.logEvent('form_submit', {
        type: 'account.forgot-password',
        user: cleaned.email,
      })
    )
}

export const ForgotPassword = () => {
  const fields = useFields<{ email: string }>({
    email: { constraints: 'required email', label: 'Email Address' },
  })
  const analytics = useAnalytics()

  const onSubmit = async () => {
    return requestChangePassword(fields, analytics).catch((err) => {
      try {
        throw err.response.data.data[0].messages.map((v: any) => v.message)
      } catch {
        throw 'Unable to change password'
      }
    })
  }

  const Success = () => (
    <div className="z-10 absolute inset-0 justify-center items-center bg-white border-gray border rounded-md">
      <span className="text-lg">Please check your email</span>
    </div>
  )

  return (
    <Form
      fields={fields}
      onSubmit={onSubmit}
      Success={Success}
      className="max-w-lg p-4 bg-white rounded-md"
    >
      <FormHeader label="Forgot password?" />
      <Input field={fields.get('email')} />
      <Submit field={fields.form}>Request Password Reset</Submit>
      <OR />
      <BlueLink href="/account/register" label="Create a new Account" />
    </Form>
  )
}
export default ForgotPassword
