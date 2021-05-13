import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'
import Form, {
  Input,
  Submit,
  Warnings,
  PasswordVisible,
  FormHeader,
  OR,
} from '@/Form'
import useFields, { isValid, cleanFields } from '@/Form/useFields'

import AccountForm from './AccountForm'

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
      .post(
        '/auth/forgot-password',
        {
          email: cleaned.email,
        },
        { withCredentials: true },
      )
      .then((res) => {
        // setStatus("success")
        app?.logEvent('form_submit', {
          type: 'account.forgot-password',
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
    <AccountForm>
      <Form onSubmit={onSubmit}>
        <FormHeader label="Forgot password?" />

        {status === 'server-error' && <Warnings warnings={warnings} />}
        <Input {...fields.email} />
        <Submit
          disabled={!isValid(fields) || status === 'success'}
          onSubmit={() => onSubmit()}
        >
          Request Password Reset
        </Submit>

        <OR />

        <Link href="/account/register">
          <a>
            <span className="cursor-pointer text-blue-500">
              Create a new Account
            </span>
          </a>
        </Link>
      </Form>
    </AccountForm>
  )
}
export default ForgotPassword
