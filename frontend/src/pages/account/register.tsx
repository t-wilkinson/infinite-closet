import React from 'react'
import { useRouter } from 'next/router'

import Form from '@/Form'
import Register, { AlreadyHaveAccount } from '@/Account/Register'
import Account from '@/Account'

export const Page = () => {
  const router = useRouter()

  return (
    <Account>
      <Form>
        <Register
          onSubmit={() => {
            router.push('/')
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
