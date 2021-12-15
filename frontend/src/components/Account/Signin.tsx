import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import axios from '@/utils/axios'
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
import { StrapiUser } from '@/types/models'

export const Signin = ({
  onSubmit = () => {},
  redirect,
}: {
  onSubmit?: () => void
  redirect?: string
}) => {
  const fields = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
    password: { constraints: 'required', label: 'Password' },
  })
  const dispatch = useDispatch()
  const analytics = useAnalytics()

  const signinUser = async () => {
    const cleaned = fields.clean()
    return axios
      .post<{ user?: StrapiUser }>('/auth/local', {
        identifier: cleaned.email,
        password: cleaned.password,
      })
      .then((data) => {
        dispatch(userActions.signin(data.user))
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
      redirect={redirect}
    >
      <FormHeader label="Sign In" />
      <Input field={fields.get('email')} />
      <Password field={fields.get('password')} />
      <Submit form={fields.form}>Sign In</Submit>

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
