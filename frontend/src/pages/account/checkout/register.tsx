import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Account from '@/Account'
import { BlueLink } from '@/components'
import { FormWrapper } from '@/Form'
import Register from '@/Account/Register'

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
  const router = useRouter()

  return (
    <Account>
      <Register onSubmit={() => router.push('/user/checkout')} />
      <div className="h-4" />
      <FormWrapper>
        <span>
          <BlueLink href="/user/checkout" label="Continue to checkout" />
        </span>
        <AlreadyHaveAccount />
      </FormWrapper>
    </Account>
  )
}

export default Page
