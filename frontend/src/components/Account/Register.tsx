import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

import { Input, Warnings, Password, FormHeader, Checkbox } from '@/Form'
import { Button } from '@/components'
import useFields, { isValid, cleanFields } from '@/Form/useFields'
import { useDispatch } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import { userActions } from '@/User/slice'

export const Register = ({
  email,
  firstName,
  lastName,
  onSubmit = () => {},
}: {
  email?: string
  firstName?: string
  lastName?: string
  onSubmit?: () => void
}) => {
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
  const dispatch = useDispatch()
  const analytics = useAnalytics()
  const [warnings, setWarnings] = React.useState<string[]>([])

  const registerUser = () => {
    const cleaned = cleanFields(fields)
    console.log(cleaned)

    axios
      .post(
        '/auth/local/register',
        {
          firstName: cleaned.firstName,
          lastName: cleaned.lastName,
          email: cleaned.email,
          password: cleaned.password,
          subscribed: cleaned.mailingList && 'mailinglist',
        },
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(userActions.signin(res.data.user))
        analytics.logEvent('form_submit', {
          type: 'account.register',
          user: cleaned.email,
        })
        onSubmit()
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
      <FormHeader label="Join Us for Free" />
      <Warnings warnings={warnings} />
      <div className="flex-row space-x-2">
        <Input {...fields.firstName} />
        <Input {...fields.lastName} />
      </div>
      <Input {...fields.email} />
      <Password {...fields.password} />
      <Checkbox {...fields.mailingList} className="mt-2 mb-4" />
      <Button onClick={registerUser} disabled={!isValid(fields)}>
        Register
      </Button>
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
