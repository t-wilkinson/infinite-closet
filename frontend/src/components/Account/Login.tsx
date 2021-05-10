import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

import Form, {
  Input,
  Submit,
  OR,
  Warnings,
  PasswordVisible,
  FormHeader,
} from '@/Form'
import useFields, { isValid, cleanFields } from '@/Form/useFields'

import AccountForm from './AccountForm'
import { accountActions } from './slice'

export const Login = () => {
  const fields = useFields({
    email: { constraints: 'required email', label: 'Email Address' },
    password: { constraints: 'required', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const app = useAnalytics()
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)

  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
      .post('/auth/local', {
        identifier: cleaned.email,
        password: cleaned.password,
      })
      .then((res) => {
        dispatch(accountActions.login(res.data.user))
        app?.logEvent('form_submit', {
          type: 'account.login',
          user: cleaned.email,
        })
        router.push('/')
      })
      .catch((err) => {
        try {
          console.error(err.response.data.data[0].messages)
          setWarnings(err.response.data.data[0].messages.map((v) => v.message))
        } catch {
          console.error('Unknown error: ' + err)
          setWarnings(['Somethings not right... Try again?'])
        }
      })
  }

  return (
    <AccountForm>
      <Form onSubmit={onSubmit}>
        <FormHeader label="Sign in to Infinite Closet" />
        <Warnings warnings={warnings} />
        <Input {...fields.email} />
        <Input
          {...fields.password}
          type={passwordVisible ? 'text' : 'password'}
        >
          <PasswordVisible
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
          />
        </Input>
        <Submit disabled={!isValid(fields)}> Sign In </Submit>

        <OR />

        <Link href="/account/forgot-password">
          <a>
            <span className="cursor-pointer text-blue-500">
              Forgot Password?
            </span>
          </a>
        </Link>
      </Form>

      <CreateAnAccount />
    </AccountForm>
  )
}
export default Login

const CreateAnAccount = () => (
  <Form>
    <span>
      New to Infinite Closet?{' '}
      <Link href="/account/register">
        <a>
          <span className="cursor-pointer text-blue-500">
            Create an account
          </span>
        </a>
      </Link>
    </span>
  </Form>
)
