import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import {
  useFields,
  Form,
  Submit,
  Input,
  OR,
  Password,
  FormHeader,
} from '@/Form'
import { userActions } from '@/User/slice'
import { BlueLink } from '@/components'

export const Signin = ({ onSubmit = () => {} }) => {
  const fields = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
    password: { constraints: 'required', label: 'Password' },
  })
  const dispatch = useDispatch()
  const analytics = useAnalytics()

  const signinUser = async () => {
    const cleaned = fields.clean()
    return axios
      .post(
        '/auth/local',
        {
          identifier: cleaned.email,
          password: cleaned.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(userActions.signin(res.data.user))
        analytics.logEvent('form_submit', {
          type: 'account.signin',
          user: cleaned.email,
        })
        return onSubmit()
      })
      .catch(() => {
        throw 'Email or password invalid'
      })
  }

  return (
    <Form
      fields={fields}
      onSubmit={signinUser}
      className="max-w-lg px-4 py-4 bg-white rounded-md"
    >
      <FormHeader label="Sign In" />
      <Input field={fields.get('email')} />
      <Password field={fields.get('password')} />
      <Submit field={fields.form}>Sign In</Submit>

      <OR />

      <div className="inline-block">
        <BlueLink href="/account/forgot-password" label="Forgot Password?" />
      </div>
    </Form>
  )
}

export const CreateAnAccount = () => {
  const router = useRouter()
  const redir = router.query.redir

  return (
    <span>
      New to Infinite Closet?{' '}
      <Link href={`/account/register${redir ? `?redir=${redir}` : ''}`}>
        <a>
          <span className="cursor-pointer text-blue-500">
            Create an account
          </span>
        </a>
      </Link>
    </span>
  )
}

export default Signin
