import React from 'react'
import { useRouter } from 'next/router'

import Form from '@/Form'
import Register, { AlreadyHaveAccount } from '@/Account/Register'
import Account from '@/Account'
import { useSelector } from '@/utils/store'

export const Page = () => {
  const user = useSelector((state) => state.user.data)
  const router = useRouter()
  const redir = Array.isArray(router.query.redir)
    ? router.query.redir[0]
    : router.query.redir

  if (user) {
    router.push('/')
  }

  return (
    <Account>
      <Form>
        <Register
          onSubmit={() => {
            redir ? router.push(redir) : router.back()
          }}
        />
      </Form>
      <div className="h-4" />
      <Form>
        <AlreadyHaveAccount />
      </Form>
    </Account>
  )
}

export default Page
