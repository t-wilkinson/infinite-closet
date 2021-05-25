import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Icon } from '@/components'
import { useDispatch, useSelector } from '@/utils/store'

import { layoutActions } from './slice'
import Navbar from './Navbar'
const HeaderAside = dynamic(() => import('./HeaderAside'))

const SmallHeader = () => {
  const dispatch = useDispatch()

  return (
    <>
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
    </>
  )
}

const LargeHeader = ({ user, router }) => (
  <>
    <div className="lg:flex-row px-4 justify-center w-full items-center max-w-screen-xl relative h-32 w-full justify-between items-center">
      <LargeHeaderLogo router={router} />
      <div className="w-full lg:w-auto flex-grow mx-8">
        <Navbar />
      </div>
      <div className="absolute right-0 mt-4 mr-4 lg:m-0 lg:static">
        <Account user={user} />
      </div>
    </div>
  </>
)

export const LargeHeaderLogo = ({ router }) => (
  <Link href="/">
    <a>
      <span className="text-4xl font-header">INFINITE CLOSET</span>
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
          <IconLink href="/user/checkout" size={18} name="shopping-bag" />
        </>
      ) : (
        <>
          <Link href="/account/signin">
            <a>
              <span className="">Sign In</span>
            </a>
          </Link>
          {/* <IconLink href="/user/saved" size={18} name="heart" /> */}
          {/* <IconLink href="/user/checkout" size={18} name="shopping-bag" /> */}
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
  const router = useRouter()

  return (
    <header>
      <div className="p-4 border-b border-gray-light mb-6 flex md:hidden items-center">
        <SmallHeader />
      </div>
      <div className="z-30 items-center hidden w-full pt-4 md:flex select-none relative mb-4">
        <LargeHeader user={user} router={router} />
      </div>
    </header>
  )
}

export default Header
