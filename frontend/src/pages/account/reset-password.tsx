import React from 'react'
import { useRouter } from 'next/router'

import Form from '@/Form'
import ResetPassword from '@/Account/ResetPassword'
import { LargeHeaderLogo } from '@/Layout/Header'

export const Page = () => {
  const router = useRouter()
  return (
    <>
      <div className="items-center mt-3">
        <LargeHeaderLogo router={router} />
      </div>
      <div className="bg-gray-light h-full pt-16">
        <Form>
          <ResetPassword />
        </Form>
      </div>
    </>
  )
}

export default Page
