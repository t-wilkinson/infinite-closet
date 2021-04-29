import React from 'react'
import axios from 'axios'
import Link from 'next/link'

import { Input, Form, Submit, OR, useFields } from './components'

export const ForgotPassword = () => {
  const form = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
  })

  return (
    <div className="py-16 bg-gray-light space-y-8 h-full">
      <Form>
        <span className="font-subheader-light text-xl mb-6">
          Forgot password?
        </span>

        <Input {...form.email} />

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
    .post('/auth/forgot-password', {
      email: state.email,
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
