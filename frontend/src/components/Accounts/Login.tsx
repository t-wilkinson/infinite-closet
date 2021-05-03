import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { Icon } from '@/components'
import { useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

import { accountsActions } from './slice'
import {
  Input,
  Form,
  Submit,
  OR,
  Warning,
  useFields,
  isValid,
  cleanFields,
} from './components'

export const Login = () => {
  const fields = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
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
      .post('/auth/local', {
        identifier: cleaned.email,
        password: cleaned.password,
      })
      .then((res) => {
        dispatch(accountsActions.login(res.data.user))
        dispatch(accountsActions.addJWT(res.data.jwt))
        app.logEvent('form_submit', {
          type: 'accounts.login',
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
    <div className="py-16 bg-gray-light space-y-8 h-full">
      <Form>
        <Image src="/icons/logo-transparent.svg" width={64} height={64} />
        <span className="text-center font-subheader-light text-xl mb-6">
          Sign in to Infinite Closet
        </span>

        {warnings.map((warning) => (
          <Warning key={warning}>{warning}</Warning>
        ))}
        <Input {...fields.email} />
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
          Sign In
        </Submit>

        <OR />

        <Link href="/accounts/forgot-password">
          <a>
            <span className="cursor-pointer text-blue-500">
              Forgot Password?
            </span>
          </a>
        </Link>
      </Form>

      <Form>
        <span>
          New to Infinite Closet?{' '}
          <Link href="/accounts/register">
            <a>
              <span className="cursor-pointer text-blue-500">
                Create an account
              </span>
            </a>
          </Link>
        </span>
      </Form>
    </div>
  )
}
export default Login
