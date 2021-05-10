import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'
import { useDispatch } from '@/utils/store'
import Form, {
  Input,
  Submit,
  Warnings,
  PasswordVisible,
  FormHeader,
  OR,
} from '@/Form'
import useFields, { isValid, cleanFields } from '@/Form/useFields'

import { accountActions } from './slice'
import AccountForm from './AccountForm'

export const ForgotPassword = () => {
  const fields = useFields({
    password: { constraints: 'required', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const app = useAnalytics()
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)
  const code = router.query.code

  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
      .post('/auth/reset-password', {
        code,
        password: cleaned.password,
        passwordConfirmation: cleaned.password,
      })
      .then((res) => {
        dispatch(accountActions.login(res.data.user))
        app.logEvent('form_submit', {
          type: 'account.reset-password',
          user: cleaned.email,
        })
        router.push('/')
      })
      .catch((err) => {
        console.error(err.response.data.data[0].messages)
        setWarnings(err.response.data.data[0].messages.map((v) => v.message))
      })
  }

  return (
    <AccountForm>
      <Form onSubmit={onSubmit}>
        <FormHeader label="Forgot password?" />
        <Warnings warnings={warnings} />
        <Input
          {...fields.password}
          type={passwordVisible ? 'text' : 'password'}
        >
          <PasswordVisible
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
          />
        </Input>
        <Submit disabled={!isValid(fields)}>Request Password Reset</Submit>

        <OR />

        <Link href="/account/register">
          <a>
            <span className="cursor-pointer text-blue-500">
              Create a new Account
            </span>
          </a>
        </Link>
      </Form>
    </AccountForm>
  )
}
export default ForgotPassword
