import React from 'react'
import axios from 'axios'
import Link from 'next/link'

import { Input, Form, Submit, OR, useForm } from './components'

export const Login = () => {
  const form = useForm({
    email: { constraints: 'required email', label: 'Email Address' },
    password: { constraints: 'required', label: 'Password' },
  })

  return (
    <div className="py-16 bg-gray-light space-y-8">
      <Form>
        <span className="font-subheader-light text-xl mb-6">
          Sign in to your account
        </span>

        <Input {...form.email} />
        <Input {...form.password} type="password" />
        <Submit disabled={!form.valid} onSubmit={() => onSubmit(form.state)}>
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

const onSubmit = (state) => {
  axios
    .post('/auth/local', {
      identifier: state.email,
      password: state.password,
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}
