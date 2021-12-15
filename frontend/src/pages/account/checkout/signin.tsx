import React from 'react'
import Link from 'next/link'

import Account from '@/Account'
import { BlueLink } from '@/components'
import { FormWrapper } from '@/Form'
import Signin from '@/Account/Signin'

export const Page = () => {
  return (
    <Account>
      <Signin redirect="/buy" />
      <div className="h-4" />
      <FormWrapper>
        <span>
          <BlueLink href="/buy" label="Continue to checkout" />
        </span>
        <span>
          New to Infinite Closet?{' '}
          <Link href="/account/checkout/register">
            <a>
              <span className="cursor-pointer text-blue-500">
                Create an account
              </span>
              .
            </a>
          </Link>
        </span>
      </FormWrapper>
    </Account>
  )
}

export default Page
