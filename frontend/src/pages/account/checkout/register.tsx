import React from 'react'
import Link from 'next/link'

import Account from '@/Layout/Account'
import { BlueLink } from '@/Components'
import { FormWrapper } from '@/Form'
import Register from '@/Form/Register'

export const AlreadyHaveAccount = () => (
  <span>
    Already have an account?{' '}
    <Link href="/account/checkout/signin">
      <a>
        <span className="cursor-pointer text-blue-500">Sign In</span>
      </a>
    </Link>
    .
  </span>
)

export const Page = () => {
  return (
    <Account>
      <Register redirect="/buy"/>
      <div className="h-4" />
      <FormWrapper>
        <span>
          <BlueLink href="/buy" label="Continue to checkout" />
        </span>
        <AlreadyHaveAccount />
      </FormWrapper>
    </Account>
  )
}

export default Page
