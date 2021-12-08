import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import axios from '@/utils/axios'
import useAnalytics from '@/utils/useAnalytics'
import { useDispatch } from '@/utils/store'
import { userActions } from '@/User/slice'
import { useFields, Form, Submit, Password, FormHeader, OR } from '@/Form'
import {StrapiUser} from '@/utils/models'

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
    .post<{user: StrapiUser}>(
        '/auth/reset-password',
        {
          code,
          password: cleaned.password,
          passwordConfirmation: cleaned.password,
        }
      )
      .then((data) => {
        dispatch(userActions.signin(data.user))
        analytics.logEvent('form_submit', {
          type: 'account.reset-password',
          user: cleaned.email,
        })
        router.push('/')
      })
      .catch((err) => {
        try {
          throw err.response.data.data[0].messages.map((v: any) => v.message)
        } catch {
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
