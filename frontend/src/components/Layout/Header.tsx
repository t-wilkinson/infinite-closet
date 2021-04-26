import React from 'react'
import Link from 'next/link'

import Navbar from './Navbar'

const SmallHeader = () => (
  <div className="flex items-center p-4 mb-6 border-b border-gray-light md:hidden">
    <div className="flex-row items-center w-full mr-2">
      <Link href="/landing-page">
        <span className="ml-4 font-header font-lg">INFINITE CLOSET</span>
      </Link>
    </div>
  </div>
)

const LargeHeader = () => (
  <div className="z-20 items-center justify-center hidden w-full pt-4 mb-8 border-b-2 border-gray-light md:flex">
    <Link href="/landing-page">
      <div className="items-center mb-2 cursor-pointer">
        <span className="text-4xl font-header">INFINITE CLOSET</span>
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
