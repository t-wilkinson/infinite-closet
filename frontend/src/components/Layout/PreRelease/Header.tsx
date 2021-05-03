import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Icon } from '@/components'
import { useDispatch } from '@/utils/store'

import { layoutActions } from '../slice'
import Navbar from '../Navbar'
import HeaderAside from './HeaderAside'

const SmallHeader = () => {
  const dispatch = useDispatch()

  return (
    <div className="p-4 border-b border-gray-light mb-6 flex md:hidden items-center">
      <div className="flex-row items-center content-between w-full mr-2 select-none">
        <button onClick={() => dispatch(layoutActions.toggleHeader())}>
          <Icon name="menu" size={20} />
        </button>
        <Link href="/">
          <a>
            <span className="ml-4 font-header font-lg">INFINITE CLOSET</span>
          </a>
        </Link>
      </div>
      <HeaderAside />
    </div>
  )
}

const LargeHeader = () => (
  <div className="z-20 items-center hidden w-full pt-4 mb-8 md:flex select-none">
    <Link href="/">
      <a>
        <div className="items-center mb-2 cursor-pointer">
          <div className="-my-4">
            <Image width={100} height={80} src="/icons/logo-transparent.svg" />
          </div>
          <span className="text-4xl font-header">INFINITE CLOSET</span>
          <span className="text-xl font-header">LESS IS MORE</span>
        </div>
      </a>
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
