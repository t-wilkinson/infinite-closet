import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'
import { useDispatch } from '@/utils/store'
import { Warnings, Password, FormHeader, OR } from '@/Form'
import { Button } from '@/components'
import useFields, { isValid, cleanFields } from '@/Form/useFields'
import { userActions } from '@/User/slice'

export const ResetPassword = () => {
  const fields = useFields({
    password: { constraints: 'required password', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const analytics = useAnalytics()
  const [warnings, setWarnings] = React.useState<string[]>([])
  const code = router.query.code

  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
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
          console.error(err.response.data.data[0].messages)
          setWarnings(err.response.data.data[0].messages.map((v) => v.message))
        } else {
          console.error(err)
          setWarnings(['Could not change password'])
        }
      })
  }

  return (
    <>
      <FormHeader label="Reset password" />
      <Warnings warnings={warnings} />
      <Password {...fields.password} />
      <Button onClick={onSubmit} disabled={!isValid(fields)}>
        Password Reset
      </Button>

      <OR />

      <Link href="/account/register">
        <a>
          <span className="cursor-pointer text-blue-500">
            Create a new Account
          </span>
        </a>
      </Link>
    </>
  )
}

export default ResetPassword
