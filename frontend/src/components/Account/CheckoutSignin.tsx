import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Account from '@/Account'
import { BlueLink } from '@/components'
import Form from '@/Form'
import Signin from '@/Account/Signin'

export const GuestCheckout = () => {
  const router = useRouter()

  return (
    <Account>
      <Form onClick={(e) => e.stopPropagation()}>
        <Signin onSubmit={() => router.push('/user/checkout')} />
      </Form>
      <div className="h-4" />
      <Form>
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
      </Form>
    </Account>
  )
}

export default GuestCheckout
