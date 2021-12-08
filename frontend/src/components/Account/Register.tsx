import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

import {
  useFields,
  Form,
  Submit,
  Input,
  Password,
  FormHeader,
  Checkbox,
} from '@/Form'
import { useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import { userActions } from '@/User/slice'

interface Register {
  email?: string
  firstName?: string
  lastName?: string
  onSubmit?: () => void
}

export const useRegisterUser = ({
  onError = console.error,
  onSubmit = () => {},
} = {}) => {
  const dispatch = useDispatch()
  const analytics = useAnalytics()

  const registerUser = (fields: { [key: string]: any }) => {
    axios
      .post(
        '/auth/local/register',
        {
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          password: fields.password,
          subscribed: fields.mailingList ? 'mailinglist' : '',
        },
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(userActions.signin(res.data.user))
        analytics.logEvent('form_submit', {
          type: 'account.register',
          user: fields.email,
        })
        return onSubmit()
      })
      .catch((err) => {
        try {
          onError(err.response.data.data[0].messages.map((v) => v.message))
          throw err.response.data.data[0].messages.map((v) => v.message)
        } catch {
          onError(['Encountered unkown error'])
          throw 'Encountered unkown error'
        }
      })
  }
  return registerUser
}

export const Register = ({
  email,
  firstName,
  lastName,
  onSubmit = () => {},
}: Register) => {
  const fields = useFields({
    firstName: { constraints: 'required', default: firstName },
    lastName: { constraints: '', label: 'Last Name', default: lastName },
    email: {
      default: email,
      constraints: 'required email',
      label: 'Email Address',
    },
    password: { constraints: 'required password' },
    mailingList: { label: 'I want to receive exclusive offers' },
  } as const)
  const registerUser = useRegisterUser({ onSubmit })

  return (
    <Form fields={fields} onSubmit={() => registerUser(fields.clean())}
      className="max-w-lg p-4 bg-white rounded-md"
    >
      <FormHeader label="Join Us for Free" />
      <div className="w-full flex-row space-x-2">
        <Input field={fields.get('firstName')} />
        <Input field={fields.get('lastName')} />
      </div>
      <Input field={fields.get('email')} />
      <Password field={fields.get('password')} />
      <Checkbox field={fields.get('mailingList')} className="mt-2 mb-4" />
      <Submit field={fields.form}>Register</Submit>
    </Form>
  )
}

export const AlreadyHaveAccount = () => {
  const router = useRouter()
  const redir = router.query.redir

  return (
    <span>
      Already have an account?{' '}
      <Link href={`/account/signin${redir ? `?redir=${redir}` : ''}`}>
        <a>
          <span className="cursor-pointer text-blue-500">Sign In</span>
        </a>
      </Link>
      .
    </span>
  )
}

export default Register
