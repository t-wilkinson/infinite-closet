import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'

import {
  OR,
  Input,
  Form,
  Submit,
  Warning,
  useFields,
  isValid,
  cleanFields,
} from './components'

type Status = 'success' | 'in-fields' | 'server-error'

export const ForgotPassword = () => {
  const fields = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
  })
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [status, setStatus] = React.useState<Status>('in-fields')
  const router = useRouter()
  const app = useAnalytics()

  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
      .post('/auth/forgot-password', {
        email: cleaned.email,
      })
      .then((res) => {
        // setStatus("success")
        app.logEvent('form_submit', {
          type: 'accounts.forgot-password',
          user: cleaned.email,
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

        <Input {...fields.email} />

        <Submit
          disabled={!isValid(fields) || status === 'success'}
          onSubmit={() => onSubmit()}
        >
          Request Password Reset
        </Submit>

        <OR />

        <Link href="/accounts/register">
          <a>
            <span className="cursor-pointer text-blue-500">
              Create a new Account
            </span>
          </a>
        </Link>
      </Form>
    </div>
  )
}
export default ForgotPassword
