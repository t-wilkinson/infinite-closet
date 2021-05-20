import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { Icon } from '@/components'
import { useDispatch, useSelector } from '@/utils/store'

import { layoutActions } from './slice'
import Navbar from './Navbar'
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

const LargeHeader = ({ user }) => (
  <div className="z-30 items-center hidden w-full pt-4 mb-8 md:flex select-none relative ">
    <div className="flex-row justify-center w-full items-center max-w-screen-xl relative">
      <LargeHeaderLogo />
      {process.env.NEXT_PUBLIC_RELEASE ? (
        <div className="absolute right-0">
          <Account user={user} />
        </div>
      ) : null}
    </div>
    <Navbar />
  </div>
)

const LargeHeaderLogo = () => (
  <Link href="/">
    <a>
      {process.env.NEXT_PUBLIC_RELEASE ? (
        <div className="flex-row items-center mb-2 cursor-pointer">
          <div className="w-10 mb-1">
            <Icon name="logo" className="text-pri" />
          </div>
          <div className="w-4" />
          <span className="text-4xl font-header">INFINITE CLOSET</span>
        </div>
      ) : (
        <div className="items-center mb-2 cursor-pointer">
          <div className="w-24 mb-2">
            <Icon name="logo" className="text-pri" />
          </div>
          <span className="text-4xl font-header">INFINITE CLOSET</span>
          <span className="text-lg font-header">LESS IS MORE</span>
        </div>
      )}
    </a>
  </Link>
)

const Account = ({ user }) => {
  return (
    <div className="flex-row items-center">
      {user ? (
        <>
          <IconLink href="/user/profile" size={18} name="user" />
          {/* <IconLink href="/user/saved" size={18} name="heart" /> */}
          <IconLink href="/user/order" size={18} name="shopping-bag" />
        </>
      ) : (
        <>
          <Link href="/account/login">
            <a>
              <span className="font-bold">Sign In</span>
            </a>
          </Link>
          {/* <IconLink href="/user/saved" size={18} name="heart" /> */}
          <IconLink href="/user/order" size={18} name="shopping-bag" />
        </>
      )}
    </div>
  )
}

const IconLink = ({ size, name, href }) => (
  <Link href={href}>
    <a className="p-2">
      <Icon size={size} name={name} />
    </a>
  </Link>
)

export const Header = () => {
  const user = useSelector((state) => state.account.user)

  return (
    <header>
      <SmallHeader />
      <LargeHeader user={user} />
    </header>
  )
}

export default Header
