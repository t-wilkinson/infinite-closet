import React from 'react'

import Form from '@/Form'
import ResetPassword from '@/Account/ResetPassword'
import Account from '@/Account'

export const Page = () => {
  return (
    <Account>
      <Form>
        <ResetPassword />
      </Form>
    </Account>
  )
}

export default Page
