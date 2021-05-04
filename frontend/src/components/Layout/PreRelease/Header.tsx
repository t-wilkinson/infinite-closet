import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { Icon } from '@/components'
import { useDispatch } from '@/utils/store'

import { layoutActions } from '../slice'
import Navbar from '../Navbar'
const HeaderAside = dynamic(() => import('./HeaderAside'))

const SmallHeader = () => {
  const dispatch = useDispatch()

  return (
    <div className="p-4 border-b border-gray-light mb-6 flex md:hidden items-center">
      <div className="flex-row items-center content-between w-full mr-2 select-none">
        <button
          onClick={() => dispatch(layoutActions.toggleHeader())}
          aria-label="Toggle side navigation"
          className="p-2"
        >
          <Icon name="menu" size={28} />
        </button>
        <Link href="/">
          <a>
            <span className="p-2 font-header text-xl">INFINITE CLOSET</span>
          </a>
        </Link>
      </div>
      <HeaderAside />
    </div>
  )
}

const LargeHeader = () => (
  <div className="z-30 items-center hidden w-full pt-4 mb-8 md:flex select-none">
    <Link href="/">
      <a>
        <div className="items-center mb-2 cursor-pointer">
          <div className="w-24 mb-2">
            <Icon name="logo" className="text-pri" />
          </div>
          <span className="text-4xl font-header">INFINITE CLOSET</span>
          <span className="text-lg font-header">LESS IS MORE</span>
        </div>
      </a>
    </Link>
    <Navbar />
  </div>
)

export const Header = () => (
  <header>
    <SmallHeader />
    <LargeHeader />
  </header>
)

export default Header
