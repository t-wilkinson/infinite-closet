import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useDispatch } from '@/utils/store'

import { accountsActions } from './slice'
import { Input, Form, Submit, useFields } from './components'

export const Register = () => {
  const form = useFields({
    name: { constraints: 'required', label: 'First Name' },
    email: { constraints: 'required email', label: 'Email Address' },
    password: { constraints: 'required', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <div className="py-16 bg-gray-light space-y-8 h-full">
      <Form>
        <span className="font-subheader-light text-xl mb-6">Join us</span>
        <Input {...form.name} />
        <Input {...form.email} />
        <Input {...form.password} type="password" />
        <Submit
          disabled={!form.valid}
          onSubmit={() => onSubmit(form.state, router, dispatch)}
        >
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

const onSubmit = (state, router, dispatch) => {
  axios
    .post('/auth/local/register', {
      name: state.name,
      email: state.email,
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
