import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Account from '@/Account'
import { BlueLink } from '@/components'
import Form from '@/Form'
import Register from '@/Account/Register'

export const GuestCheckout = () => {
  const router = useRouter()

  return (
    <Account>
      <Form onClick={(e) => e.stopPropagation()}>
        <Register onSubmit={() => router.push('/user/checkout')} />
      </Form>
      <div className="h-4" />
      <Form>
        <span>
          <BlueLink href="/user/checkout" label="Continue to checkout" />
        </span>
        <AlreadyHaveAccount />
      </Form>
    </Account>
  )
}

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

export default GuestCheckout
