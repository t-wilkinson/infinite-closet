import React from 'react'
import axios from 'axios'
import Link from 'next/link'

import useAnalytics from '@/utils/useAnalytics'
import { Input, Warnings, FormHeader, OR } from '@/Form'
import useFields, { isValid, cleanFields } from '@/Form/useFields'
import { Button } from '@/components'

type Status = 'success' | 'in-fields' | 'server-error'

export const requestChangePassword = async (fields, analytics) => {
  const cleaned = cleanFields(fields)
  return await axios
    .post(
      '/auth/forgot-password',
      {
        email: cleaned.email,
      },
      { withCredentials: true }
    )
    .then((res) =>
      analytics.logEvent('form_submit', {
        type: 'account.forgot-password',
        user: cleaned.email,
      })
    )
}

export const ForgotPassword = () => {
  const fields = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
  })
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [status, setStatus] = React.useState<Status>('in-fields')
  const analytics = useAnalytics()

  const onSubmit = () => {
    requestChangePassword(fields, analytics)
      .then(() => {
        setStatus('success')
      })
      .catch((err) => {
        setStatus('server-error')
        console.error(err.response.data.data[0].messages)
        setWarnings(err.response.data.data[0].messages.map((v) => v.message))
      })
  }

  return (
    <>
      <FormHeader label="Forgot password?" />

      {status === 'server-error' && <Warnings warnings={warnings} />}
      <Input {...fields.email} />
      <Button
        disabled={!isValid(fields) || status === 'success'}
        onClick={onSubmit}
      >
        Request Password Reset
      </Button>

      <OR />

      <Link href="/account/register">
        <a>
          <span className="cursor-pointer text-blue-500">
            Create a new Account
          </span>
        </a>
      </Link>
      {status === 'success' && (
        <div className="z-10 absolute inset-0 justify-center items-center bg-white border-gray border rounded-md">
          <span className="text-lg">Please check your email</span>
        </div>
      )}
    </>
  )
}
export default ForgotPassword
