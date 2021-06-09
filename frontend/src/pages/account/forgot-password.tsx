import React from 'react'

import Form from '@/Form'
import ForgotPassword from '@/Account/ForgotPassword'
import Account from '@/Account'

export const Page = () => {
  return (
    <Account>
      <Form>
        <ForgotPassword />
      </Form>
    </Account>
  )
}

export default Page
