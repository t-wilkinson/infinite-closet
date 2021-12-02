import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

import { Submit, Input, Warnings, Password, FormHeader, Checkbox } from '@/Form'
import useFields, { isError, cleanFields } from '@/Form/useFields'
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

  const registerUser = (fields) => {
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
        onSubmit()
      })
      .catch((err) => {
        try {
          console.error(err.response.data.data[0].messages)
          onError(err.response.data.data[0].messages.map((v) => v.message))
        } catch {
          onError(['Encountered unkown error'])
        }
      })
  }
  return registerUser
}

export const RegisterForm = ({
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
  })
  const [warnings, setWarnings] = React.useState<string[]>([])
  const registerUser = useRegisterUser({ onError: setWarnings, onSubmit })

  return (
    <>
      <Warnings warnings={warnings} />
      <div className="w-full flex-row space-x-2">
        <Input {...fields.firstName} />
        <Input {...fields.lastName} />
      </div>
      <Input {...fields.email} />
      <Password {...fields.password} />
      <Checkbox {...fields.mailingList} className="mt-2 mb-4" />
      <Submit
        onSubmit={() => registerUser(cleanFields(fields))}
        disabled={!isError(fields)}
      >
        Register
      </Submit>
    </>
  )
}

export const Register = (props: Register) => {
  return (
    <>
      <FormHeader label="Join Us for Free" />
      <RegisterForm {...props} />
    </>
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
