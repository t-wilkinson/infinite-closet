import React from 'react'
import axios from 'axios'
import Link from 'next/link'

import { Input, Form, Submit, OR, useForm } from './components'

export const ForgotPassword = () => {
  const form = useForm({
    code: { constraints: 'required number', label: 'Reset Code' },
    password: { constraints: 'required', label: 'Password' },
  })

  return (
    <div className="py-16 bg-gray-light space-y-8">
      <Form>
        <span className="font-subheader-light text-xl mb-6">
          Forgot password?
        </span>
        <Input {...form.code} />
        <Input {...form.password} type="password" />
        <Submit disabled={!form.valid} onSubmit={() => onSubmit(form.state)}>
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

const onSubmit = (state) =>
  axios
    .post('/auth/reset-password', {
      code: state.code,
      password: state.password,
      passwordConfirmation: state.password,
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
