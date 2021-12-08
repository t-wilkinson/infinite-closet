import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Account from '@/Account'
import { BlueLink } from '@/components'
import { FormWrapper } from '@/Form'
import Signin from '@/Account/Signin'

export const Page = () => {
  const router = useRouter()

  return (
    <Account>
      <Signin onSubmit={() => router.push('/user/checkout')} />
      <div className="h-4" />
      <FormWrapper>
        <span>
          <BlueLink href="/user/checkout" label="Continue to checkout" />
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
