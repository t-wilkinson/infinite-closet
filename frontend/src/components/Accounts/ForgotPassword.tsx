import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'

import { Input, Form, Submit, OR, Warning, useFields } from './components'

type Status = 'success' | 'in-form' | 'server-error'

export const ForgotPassword = () => {
  const form = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
  })
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [status, setStatus] = React.useState<Status>('in-form')
  const router = useRouter()
  const app = useAnalytics()

  const onSubmit = () => {
    axios
      .post('/auth/forgot-password', {
        email: form.state.email.trim(),
      })
      .then((res) => {
        // setStatus("success")
        app.logEvent('form_submit', {
          type: 'accounts.forgot-password',
          user: form.state.email,
        })
        router.push('/')
      })
      .catch((err) => {
        setStatus('server-error')
        console.error(err.response.data.data[0].messages)
        setWarnings(err.response.data.data[0].messages.map((v) => v.message))
      })
  }

  return (
    <div className="py-16 bg-gray-light space-y-8 h-full">
      <Form>
        <Image src="/icons/logo-transparent.svg" width={64} height={64} />
        <span className="font-subheader-light text-center text-xl mb-6">
          Forgot password?
        </span>

        {status === 'server-error' &&
          warnings.map((warning) => <Warning key={warning}>{warning}</Warning>)}

        <Input {...form.email} />

        <Submit
          disabled={!form.valid || status === 'success'}
          onSubmit={() => onSubmit()}
        >
          Request Password Reset
        </Submit>

        <OR />

        <Link href="/accounts/register">
          <span className="cursor-pointer text-blue-500">
            Create a new Account
          </span>
        </Link>
      </Form>
    </div>
  )
}
export default ForgotPassword
