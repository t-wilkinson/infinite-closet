import React from 'react'
import { useRouter } from 'next/router'

import Form from '@/Form'
import Signin, { CreateAnAccount } from '@/Account/Signin'
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
        <Signin
          onSubmit={() => {
            redir ? router.push(redir) : router.back()
          }}
        />
      </Form>
      <div className="h-4" />
      <Form>
        <CreateAnAccount />
      </Form>
    </Account>
  )
}

export default Page
