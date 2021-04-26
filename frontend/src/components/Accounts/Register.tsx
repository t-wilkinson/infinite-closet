import React from 'react'
import axios from 'axios'
import Link from 'next/link'

import { Input, Form, Submit, useForm } from './components'

export const Register = () => {
  const form = useForm({
    name: { constraints: 'required', label: 'First Name' },
    email: { constraints: 'required email', label: 'Email Address' },
    password: { constraints: 'required', label: 'Password' },
  })

  return (
    <div className="py-16 bg-gray-light space-y-8">
      <Form>
        <Input {...form.name} />
        <Input {...form.email} />
        <Input {...form.password} type="password" />
        <Submit disabled={!form.valid} onSubmit={() => onSubmit(form.state)}>
          Sign Up
        </Submit>
      </Form>

      <Form>
        <span>
          Already have an account?{' '}
          <Link href="/accounts/login">
            <span className="cursor-pointer text-blue-500">Sign In</span>
          </Link>
          .
        </span>
      </Form>
    </div>
  )
}
export default Register

const onSubmit = (state) => {
  axios
    .post('/auth/local/register', {
      name: state.name,
      email: state.email,
      password: state.password,
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}
