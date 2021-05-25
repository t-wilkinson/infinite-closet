import React from 'react'
import { useRouter } from 'next/router'

import Form from '@/Form'
import Signin, { CreateAnAccount } from '@/Account/Signin'
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
          <Signin />
        </Form>
        <div className="h-4" />
        <Form>
          <CreateAnAccount />
        </Form>
      </div>
    </>
  )
}

export default Page
