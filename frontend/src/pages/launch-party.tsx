import React from 'react'

import { Icon } from '@/components'
import { PaymentWrapper } from '@/Form/Payments'
import JoinLaunchParty from '@/Temp/LaunchParty'
import Layout from '@/Layout'

const Page = () => {
  return (
    <Layout title="Launch Party">
      <div className="w-full bg-pri-light items-center flex-grow">
        <div className="w-full max-w-screen-lg items-center mb-8">
          <h1 className="font-bold text-5xl mt-8">Join our Launch Party</h1>
          <div className="text-lg mb-12 space-y-2 max-w-screen-md px-4 md:px-0">
            <span className="whitespace-pre-line">
              Join us to celebrate the power of fashion to change lives.
            </span>
            <div className="lg:hidden">
              <PartyInfo />
            </div>
            <span>Tickets are first come, first serve.</span>
          </div>
          <div className="w-full flex-col-reverse items-center lg:items-start px-4 lg:px-0 lg:flex-row lg:space-x-8 flex-grow">
            <PaymentWrapper>
              <div className="bg-white w-full p-4 rounded-md shadow-md">
                <JoinLaunchParty />
              </div>
            </PaymentWrapper>
            <div className="w-full justify-evenly lg:max-w-xs flex-row flex-wrap">
              <SideBar />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const SideBar = () => (
  <>
    <div className="hidden lg:flex">
      <Details>
        <PartyInfo />
      </Details>
    </div>

    <Details>
      <div className="flex-row">
        <Icon name="clock" size={20} className="text-gray mr-6 mt-2" />
        <div className="">
          <span>Saturday, August 7, 2021</span>
          <span>8pm to 12am (BST)</span>
        </div>
      </div>
      <span className="flex flex-row items-center">
        <Icon name="pin" size={20} className="text-gray mr-6" />
        44 Great Cumberland Pl, London W1H 7BS
      </span>
    </Details>

    <Details>
      <span>
        <span className="font-bold">Sarah Korich</span>, Founder at Infinite
        Closet
      </span>
      <span>
        <span className="font-bold">Sol Escobar</span>, Founder & Director at
        Give Your Best
      </span>
      <span>
        <span className="font-bold">Kemi Ogulana</span>, volunteer and refugee
      </span>
    </Details>
  </>
)

const PartyInfo = () => (
  <>
    <span>
      Infinite Closet, London's premier independent designer rental platform,
      and Give Your Best, a non-profit where refugee women can ‘shop’ donated
      clothes for free, are partnering to empower women and improve circularity
      in the fashion industry.
    </span>
    <span>
      Join us on 7 August to learn more about Give Your Best and browse clothes
      from Infinite Closet’s latest designers.
    </span>
  </>
)

const Details = ({ children }) => (
  <div className="rounded-md lg:flex-col px-6 py-4 w-full mb-8 lg:mb-8 max-w-xs h-36 bg-white space-y-2 shadow-md">
    {children}
  </div>
)

export default Page
