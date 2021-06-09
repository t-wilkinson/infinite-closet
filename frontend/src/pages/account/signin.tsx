import React from 'react'

import Form from '@/Form'
import Signin, { CreateAnAccount } from '@/Account/Signin'
import Account from '@/Account'

export const Page = () => {
  return (
    <Account>
      <Form>
        <Signin />
      </Form>
      <div className="h-4" />
      <Form>
        <CreateAnAccount />
      </Form>
    </Account>
  )
}

export default Page
