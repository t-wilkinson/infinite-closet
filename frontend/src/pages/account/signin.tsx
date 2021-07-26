import React from 'react'
import { useRouter } from 'next/router'

import Form from '@/Form'
import Signin, { CreateAnAccount } from '@/Account/Signin'
import Account from '@/Account'

export const Page = () => {
  const router = useRouter()

  return (
    <Account>
      <Form>
        <Signin
          onSubmit={() => {
            router.push('/')
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
