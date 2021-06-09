import React from 'react'

import Form from '@/Form'
import Register, { AlreadyHaveAccount } from '@/Account/Register'
import Account from '@/Account'

export const Page = () => {
  return (
    <Account>
      <Form>
        <Register />
      </Form>
      <div className="h-4" />
      <Form>
        <AlreadyHaveAccount />
      </Form>
    </Account>
  )
}

export default Page
