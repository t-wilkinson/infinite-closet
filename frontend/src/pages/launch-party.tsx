import React from 'react'
import Head from 'next/head'

import { Icon } from '@/components'
import { PaymentWrapper } from '@/Form/Payments'
import JoinLaunchParty from '@/Temp/LaunchParty'
import Header from '@/Layout/Header'
import Footer from '@/Layout/Footer'

const Page = () => {
  return (
    <>
      <Head>
        <title>Launch Party</title>
      </Head>
      <Header />
      <div className="w-full h-full items-center pb-8 bg-gray-light">
        <div className="w-full max-w-screen-lg items-center">
          <h1 className="font-bold text-4xl my-4">Join Our Launch Party</h1>
          {/* TODO */}
          <div className="text-lg mb-4">
            <span>
              Please join us as we launch our new platform, Infinite Closet!
            </span>
            <span>Tickets are first come, first serve.</span>
          </div>
          <div className="w-full flex-col-reverse items-center lg:items-start px-4 lg:px-0 lg:flex-row lg:space-x-8">
            <PaymentWrapper>
              <div className="bg-white w-full p-4 rounded-md">
                <JoinLaunchParty />
              </div>
            </PaymentWrapper>
            <div className="rounded-md px-6 py-2 w-full max-w-xs h-36 bg-white">
              <Details />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

const Details = () => (
  <div className="my-4 space-y-4">
    <div className="flex-row">
      <Icon name="clock" size={20} className="text-gray mr-6 mt-2" />
      <div className="">
        <span>Saturday, July 3, 2021</span>
        <span>8pm to 12am</span>
      </div>
    </div>
    <span className="flex flex-row items-center">
      {/* TODO */}
      <Icon name="pin" size={20} className="text-gray mr-6" />
      Home Grown
    </span>
  </div>
)

export default Page
