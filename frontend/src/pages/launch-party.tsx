import React from 'react'
import Head from 'next/head'

import { PaymentWrapper } from '@/Form/Payments'
import JoinLaunchParty from '@/User/JoinLaunchParty'
import Header from '@/Layout/Header'
import Footer from '@/Layout/Footer'

const Page = () => {
  return (
    <>
      <Head>
        <title>Launch Party</title>
      </Head>
      <Header />
      <div className="w-full h-full items-center mb-8">
        <div className="w-full max-w-screen-sm items-center">
          <span className="font-bold text-4xl my-4">Join Our Launch Party</span>
          <PaymentWrapper>
            <JoinLaunchParty />
          </PaymentWrapper>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Page
