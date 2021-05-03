import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'
import { accountsActions } from './slice'
import { useDispatch } from '@/utils/store'
import { Icon } from '@/components'

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

export const ForgotPassword = () => {
  const fields = useFields({
    code: { constraints: 'required', label: 'Reset Code' },
    password: { constraints: 'required', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const app = useAnalytics()
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)

  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
      .post('/auth/reset-password', {
        code: cleaned.code,
        password: cleaned.password,
        passwordConfirmation: cleaned.password,
      })
      .then((res) => {
        dispatch(accountsActions.login(res.data.user))
        dispatch(accountsActions.addJWT(res.data.jwt))
        app.logEvent('form_submit', {
          type: 'accounts.reset-password',
          user: cleaned.email,
        })
        router.push('/')
      })
      .catch((err) => {
        console.error(err.response.data.data[0].messages)
        setWarnings(err.response.data.data[0].messages.map((v) => v.message))
      })
  }

  return (
    <div className="py-16 bg-gray-light space-y-8">
      <Form>
        <Image src="/icons/logo-transparent.svg" width={64} height={64} />
        <span className="font-subheader-light text-center text-xl mb-6">
          Forgot password?
        </span>

        {warnings.map((warning) => (
          <Warning key={warning}>{warning}</Warning>
        ))}
        <Input {...fields.code} />
        <Input
          {...fields.password}
          type={passwordVisible ? 'text' : 'password'}
        >
          <button
            className="flex flex-row items-center absolute right-0 h-full pr-2"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <Icon name="eye" size={24} />
            ) : (
              <Icon name="eye-hidden" size={24} />
            )}
          </button>
        </Input>
        <Submit disabled={!isValid(fields)} onSubmit={() => onSubmit()}>
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
