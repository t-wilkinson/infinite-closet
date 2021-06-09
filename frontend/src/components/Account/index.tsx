import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { LargeHeaderLogo } from '@/Layout/Header'

export const Account = ({ title = 'Infinite Closet', children }) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="items-center mt-3">
        <LargeHeaderLogo router={router} />
      </div>
      <div className="bg-gray-light h-full pt-16">{children}</div>
    </>
  )
}

export default Account
