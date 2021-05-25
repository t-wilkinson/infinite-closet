import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

import { Input, Submit, Warnings, PasswordVisible, FormHeader } from '@/Form'
import useFields, { isValid, cleanFields } from '@/Form/useFields'
import { useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import { accountActions } from '@/Account/slice'
import { userActions } from '@/User/slice'

export const Register = () => {
  const fields = useFields({
    firstName: { constraints: 'required' },
    lastName: { constraints: '', label: 'Last Name' },
    email: { constraints: 'required email', label: 'Email Address' },
    password: { constraints: 'required' },
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
        '/auth/local/register',
        {
          firstName: cleaned.firstName,
          lastName: cleaned.firstName,
          email: cleaned.email,
          password: cleaned.password,
        },
        { withCredentials: true },
      )
      .then((res) => {
        dispatch(userActions.signin(res.data.user))
        app?.logEvent('form_submit', {
          type: 'account.register',
          user: cleaned.email,
        })
        router.push('/')
      })
      .catch((err) => {
        try {
          console.error(err.response.data.data[0].messages)
          setWarnings(err.response.data.data[0].messages.map((v) => v.message))
        } catch {
          setWarnings(['Encountered unkown error'])
        }
      })
  }

  return (
    <>
      <FormHeader label="Join us for free" />
      <Warnings warnings={warnings} />
      <div className="flex-row space-x-2">
        <Input {...fields.firstName} />
        <Input {...fields.lastName} />
      </div>
      <Input {...fields.email} />
      <Input
        // TODO: this logic should be in useFields
        {...fields.password}
        type={passwordVisible ? 'text' : 'password'}
      >
        <PasswordVisible
          passwordVisible={passwordVisible}
          setPasswordVisible={setPasswordVisible}
        />
      </Input>
      <Submit onSubmit={onSubmit} disabled={!isValid(fields)}>
        Sign Up
      </Submit>
    </>
  )
}

export const AlreadyHaveAccount = () => {
  return (
    <span>
      Already have an account?{' '}
      <Link href="/account/signin">
        <a>
          <span className="cursor-pointer text-blue-500">Sign In</span>
        </a>
      </Link>
      .
    </span>
  )
}

export default Register
