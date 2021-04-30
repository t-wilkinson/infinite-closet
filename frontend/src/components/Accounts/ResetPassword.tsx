import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { accountsActions } from './slice'
import { useDispatch } from '@/utils/store'
import { Icon } from '@/components'

import { Input, Form, Submit, OR, Warning, useFields } from './components'

export const ForgotPassword = () => {
  const form = useFields({
    code: { constraints: 'required', label: 'Reset Code' },
    password: { constraints: 'required', label: 'Password' },
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)

  return (
    <div className="py-16 bg-gray-light space-y-8">
      <Form>
        <Image src="/icons/logo-transparent.svg" width={64} height={64} />
        <span className="font-subheader-light text-center text-xl mb-6">
          Forgot password?
        </span>

        {warnings.map((warning) => (
          <Warning key={warning}>{warning}</Warning>
        ))}
        <Input {...form.code} />
        <Input {...form.password} type={passwordVisible ? 'text' : 'password'}>
          <button
            className="flex flex-row items-center absolute right-0 h-full pr-2"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <Icon name="eye" size={24} />
            ) : (
              <Icon name="eye-hidden" size={24} />
            )}
          </button>
        </Input>
        <Submit
          disabled={!form.valid}
          onSubmit={() => onSubmit(form.state, router, dispatch, setWarnings)}
        >
          Request Password Reset
        </Submit>
        <OR />
        <Link href="/accounts/register">
          <span className="cursor-pointer text-blue-500">
            Create a new Account
          </span>
        </Link>
      </Form>
    </div>
  )
}
export default ForgotPassword

const onSubmit = (state, router, dispatch, setWarnings) => {
  axios
    .post('/auth/reset-password', {
      code: state.code,
      password: state.password,
      passwordConfirmation: state.password,
    })
    .then((res) => {
      dispatch(accountsActions.login(res.data.user))
      dispatch(accountsActions.addJWT(res.data.jwt))
      router.push('/')
    })
    .catch((err) => {
      console.error(err.response.data.data[0].messages)
      setWarnings(err.response.data.data[0].messages.map((v) => v.message))
    })
}
