import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useDispatch } from '@/utils/store'
import { Icon } from '@/components'

import { layoutActions } from './slice'
import Navbar from './Navbar'
import HeaderAside from './HeaderAside'

const SmallHeader = () => {
  const dispatch = useDispatch()

  return (
    <div className="flex items-center p-4 mb-6 border-b border-gray-light md:hidden">
      <div className="flex-row items-center w-full mr-2">
        <button onClick={() => dispatch(layoutActions.toggleHeader())}>
          <Icon name="menu" size={20} />
        </button>
        <Link href="/landing-page">
          <span className="ml-4 font-header font-lg">INFINITE CLOSET</span>
        </Link>
      </div>
      <HeaderAside />
    </div>
  )
}

const LargeHeader = () => (
  <div className="z-20 items-center justify-center hidden w-full pt-4 pb-4 md:flex relative">
    <Link href="/landing-page">
      <div className="items-end cursor-pointer flex-row">
        <div className="relative w-20 h-16">
          <Image layout="fill" src="/icons/logo-transparent.svg" />
        </div>
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
