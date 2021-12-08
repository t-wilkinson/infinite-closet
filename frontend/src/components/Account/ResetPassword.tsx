import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'
import { useDispatch } from '@/utils/store'
import { userActions } from '@/User/slice'
import { useFields, Form, Submit, Password, FormHeader, OR } from '@/Form'

export const ResetPassword = () => {
  const fields = useFields({
    password: { constraints: 'required password', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const analytics = useAnalytics()
  const code = router.query.code

  const onSubmit = async () => {
    const cleaned = fields.clean()
    return axios
      .post(
        '/auth/reset-password',
        {
          code,
          password: cleaned.password,
          passwordConfirmation: cleaned.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(userActions.signin(res.data.user))
        analytics.logEvent('form_submit', {
          type: 'account.reset-password',
          user: cleaned.email,
        })
        router.push('/')
      })
      .catch((err) => {
        if (err.response.data.data) {
          throw err.response.data.data[0].messages.map((v) => v.message)
        } else {
          throw 'Unable to change password'
        }
      })
  }

  return (
    <Form
      fields={fields}
      onSubmit={onSubmit}
      className="max-w-lg p-4 bg-white rounded-md"
    >
      <FormHeader label="Reset password" />
      <Password field={fields.get('password')} />
      <Submit field={fields.form}>Password Reset</Submit>

      <OR />

      <Link href="/account/register">
        <a>
          <span className="cursor-pointer text-blue-500">
            Create a new Account
          </span>
        </a>
      </Link>
    </Form>
  )
}

export default ResetPassword
