import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useDispatch } from '@/utils/store'

import { accountsActions } from './slice'
import { Input, Form, Submit, OR, useFields } from './components'

export const Login = () => {
  const form = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
    password: { constraints: 'required', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <div className="py-16 bg-gray-light space-y-8 h-full">
      <Form>
        <Image src="/icons/logo-transparent.svg" width={64} height={64} />
        <span className="font-subheader-light text-2xl mb-6">
          Sign in to Infinite Closet
        </span>

        <Input {...form.email} />
        <Input {...form.password} type="password" />
        <Submit
          disabled={!form.valid}
          onSubmit={() => onSubmit(form.state, router, dispatch)}
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

const onSubmit = (state, router, dispatch) => {
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
      console.error(err)
    })
}
