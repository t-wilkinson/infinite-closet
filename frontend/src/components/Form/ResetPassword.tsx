import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import axios from '@/utils/axios'
import useAnalytics from '@/utils/useAnalytics'
import { useDispatch } from '@/utils/store'
import { userActions } from '@/User/slice'
import { useFields, Form, Submit, Password, FormHeader, OR } from '@/Form'
import { StrapiUser } from '@/types/models'

export const ResetPassword = () => {
  const fields = useFields<{
    password: string
  }>({
    password: { constraints: 'required password', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const analytics = useAnalytics()
  const code = router.query.code

  const onSubmit = async () => {
    const cleaned = fields.clean()
    return axios
      .post<{ user: StrapiUser }>('/auth/reset-password', {
        code,
        password: cleaned.password,
        passwordConfirmation: cleaned.password,
      })
      .then((data) => {
        dispatch(userActions.signin(data.user))
        analytics.logEvent('form_submit', {
          type: 'account.reset-password',
        })
        router.push('/')
      })
      .catch((err) => {
        throw err.messages || 'Unable to reset password.'
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
      <Submit form={fields.form}>Password Reset</Submit>

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
