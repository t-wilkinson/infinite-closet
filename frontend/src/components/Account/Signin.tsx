import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

import {
  Input,
  Submit,
  OR,
  Warnings,
  PasswordVisible,
  FormHeader,
} from '@/Form'
import useFields, { isValid, cleanFields } from '@/Form/useFields'
import { userActions } from '@/User/slice'

export const Signin = () => {
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
      .post(
        '/auth/local',
        {
          identifier: cleaned.email,
          password: cleaned.password,
        },
        { withCredentials: true },
      )
      .then((res) => {
        dispatch(userActions.signin(res.data.user))
        app?.logEvent('form_submit', {
          type: 'account.signin',
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
    <>
      <FormHeader label="Sign In" />
      <Warnings warnings={warnings} />
      <Input {...fields.email} />
      <Input {...fields.password} type={passwordVisible ? 'text' : 'password'}>
        <PasswordVisible
          passwordVisible={passwordVisible}
          setPasswordVisible={setPasswordVisible}
        />
      </Input>
      <Submit onSubmit={onSubmit} disabled={!isValid(fields)}>
        Sign In
      </Submit>

      <OR />

      <div className="inline-block">
        <Link href="/account/forgot-password">
          <a>
            <span className="cursor-pointer text-blue-500">
              Forgot Password?
            </span>
          </a>
        </Link>
      </div>
    </>
  )
}

export const CreateAnAccount = () => (
  <span>
    New to Infinite Closet?{' '}
    <Link href="/account/register">
      <a>
        <span className="cursor-pointer text-blue-500">Create an account</span>
      </a>
    </Link>
  </span>
)

export default Signin
