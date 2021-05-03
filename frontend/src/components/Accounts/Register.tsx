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
  Warning,
  useFields,
  isValid,
  cleanFields,
} from './components'

export const Register = () => {
  const fields = useFields({
    name: { constraints: 'required', label: 'First Name' },
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
      .post('/auth/local/register', {
        name: cleaned.name,
        email: cleaned.email,
        password: cleaned.password,
      })
      .then((res) => {
        dispatch(accountsActions.login(res.data.user))
        dispatch(accountsActions.addJWT(res.data.jwt))
        app.logEvent('form_submit', {
          type: 'accounts.register',
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
          Join us
        </span>

        {warnings.map((warning) => (
          <Warning key={warning}>{warning}</Warning>
        ))}
        <Input {...fields.name} />
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
          Sign Up
        </Submit>
      </Form>

      <Form>
        <span>
          Already have an account?{' '}
          <Link href="/accounts/login">
            <a>
              <span className="cursor-pointer text-blue-500">Sign In</span>
            </a>
          </Link>
          .
        </span>
      </Form>
    </div>
  )
}
export default Register
