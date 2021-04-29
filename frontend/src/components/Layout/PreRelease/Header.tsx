import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Navbar from '../Navbar'

const SmallHeader = () => (
  <div className="p-4 border-b border-gray-light mb-6 flex md:hidden items-center">
    <div className="flex-row items-center content-between w-full mr-2">
      {/* TODO: drawer */}
      {/* <button onClick={() => toggleDrawer()}> */}
      {/*   <Ionicons name="menu-outline" size={32} /> */}
      {/* </button> */}
      <Link href="/landing-page">
        <span className="ml-4 font-header font-lg">INFINITE CLOSET</span>
      </Link>
    </div>
  </div>
)

const LargeHeader = () => (
  <div className="z-20 items-center hidden w-full pt-4 mb-8 border-b-2 border-gray-light md:flex">
    <Link href="/landing-page">
      <div className="items-center mb-2 cursor-pointer">
        <div className="-my-4">
          <Image width={140} height={120} src="/icons/logo-transparent.svg" />
        </div>
        <span className="text-4xl font-header">INFINITE CLOSET</span>
        <span className="text-xl font-header">LESS IS MORE</span>
      </div>
    </Link>
    <Navbar />
  </div>
)

export const Header = () => (
  <>
    <SmallHeader />
    <LargeHeader />
  </>
)

export default Header
