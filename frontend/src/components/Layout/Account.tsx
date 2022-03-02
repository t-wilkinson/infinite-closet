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
      <div className="items-center mt-3 mb-2">
        <LargeHeaderLogo router={router} />
      </div>
      <main className="h-full flex-shrink flex-grow flex-col items-center pt-16">
        <div className="w-full max-w-md p-4">
        {children}
        </div>
      </main>
    </>
  )
}

export default Account
