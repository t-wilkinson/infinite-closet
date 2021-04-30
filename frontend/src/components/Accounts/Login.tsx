import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { Icon } from '@/components'
import { useDispatch } from '@/utils/store'

import { accountsActions } from './slice'
import { Input, Form, Submit, OR, Warning, useFields } from './components'

export const Login = () => {
  const form = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
    password: { constraints: 'required', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)

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
        <Input {...form.email} />
        <Input {...form.password} type={passwordVisible ? 'text' : 'password'}>
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
        <Submit
          disabled={!form.valid}
          onSubmit={() => onSubmit(form.state, router, dispatch, setWarnings)}
        >
          Sign In
        </Submit>

        <OR />

        <span>
          <Link href="/accounts/forgot-password">
            <span className="cursor-pointer text-blue-500">
              Forgot Password?
            </span>
          </Link>
        </span>
      </Form>

      <Form>
        <span>
          New to Infinite Closet?{' '}
          <Link href="/accounts/register">
            <span className="cursor-pointer text-blue-500">
              Create an account
            </span>
          </Link>
        </span>
      </Form>
    </div>
  )
}
export default Login

const onSubmit = (state, router, dispatch, setWarnings) => {
  axios
    .post('/auth/local', {
      identifier: state.email,
      password: state.password,
    })
    .then((res) => {
      dispatch(accountsActions.login(res.data.user))
      dispatch(accountsActions.addJWT(res.data.jwt))
      router.push('/')
    })
    .catch((err) => {
      console.error(err.response.data.data[0].messages)
      setWarnings(err.response.data.data[0].messages.map((v) => v.message))
    })
}
