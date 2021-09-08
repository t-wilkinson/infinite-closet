import React from 'react'
import { useRouter } from 'next/router'

import Account from '@/Account'
import { BlueLink } from '@/components'
import Form from '@/Form'
import Register, { AlreadyHaveAccount } from '@/Account/Register'

export const GuestCheckout = () => {
  const router = useRouter()

  return (
    <Account>
      <Form onClick={(e) => e.stopPropagation()}>
        <Register
          onSubmit={() => {
            router.push('/user/checkout')
          }}
        />
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

export default GuestCheckout
