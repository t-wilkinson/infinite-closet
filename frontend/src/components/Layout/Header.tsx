import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Icon } from '@/components'
import { useDispatch, useSelector } from '@/utils/store'

import { layoutActions } from './slice'
import Navbar from './Navbar'
const HeaderAside = dynamic(() => import('./HeaderAside'))

const SmallHeader = ({ router }) => {
  const dispatch = useDispatch()

  return (
    <>
      <div className="flex-row items-center content-between w-full mr-2 select-none">
        <button
          onClick={() => dispatch(layoutActions.toggleHeader())}
          aria-label="Toggle side navigation"
          className="p-2"
        >
          <Icon name="menu" size={32} />
        </button>
        <Link href="/">
          <a>
            {router.pathname === '/' ? (
              <h1 className="p-2 font-header text-xl">INFINITE CLOSET</h1>
            ) : (
              <span className="p-2 font-header text-xl">INFINITE CLOSET</span>
            )}
          </a>
        </Link>
      </div>
      <HeaderAside />
    </>
  )
}

const LargeHeader = ({ user, router }) => (
  <div
    className={`max-w-screen-xl w-full justify-center
      ${router.pathname === '/' ? 'lg:h-32' : 'lg:h-16'}
    `}
  >
    <div className="lg:flex-row w-full relative justify-between items-center px-2">
      <LargeHeaderLogo router={router} />
      <div className="w-full mt-2 lg:mt-0 lg:w-auto flex-grow mx-8">
        <Navbar />
      </div>
      <div className="absolute right-0 mt-4 mr-4 lg:m-0 lg:static">
        <Account user={user} />
      </div>
      <div className="h-px bg-pri w-full lg:hidden" />
    </div>
    <div
      className={`h-px bg-pri w-full hidden lg:flex
    ${router.pathname === '/' ? 'mt-8' : 'mt-2'}
    `}
    />
  </div>
)

export const LargeHeaderLogo = ({ router }) => (
  <Link href="/">
    <a>
      {router.pathname === '/' ? (
        <h1 className="text-4xl font-header">INFINITE CLOSET</h1>
      ) : (
        <span className="text-4xl font-header">INFINITE CLOSET</span>
      )}
    </a>
  </Link>
)

const Account = ({ user }) => {
  const count = useSelector((state) => state.user.cartCount)

  return (
    <div className="flex-row items-center">
      {user ? (
        <>
          <IconLink href="/user/profile" size={18} name="user" />
          {/* <IconLink href="/user/saved" size={18} name="heart" /> */}
          <IconLink href="/user/checkout" size={18} name="shopping-bag">
            {count > 0 && (
              <span className="absolute right-0 bottom-0 text-xs bg-sec-light rounded-full px-1">
                {count}
              </span>
            )}
          </IconLink>
        </>
      ) : (
        <>
          <Link href="/account/signin">
            <a>
              <span className="">Sign in</span>
            </a>
          </Link>
          {/* <IconLink href="/user/saved" size={18} name="heart" /> */}
          {/* <IconLink href="/user/checkout" size={18} name="shopping-bag" /> */}
        </>
      )}
    </div>
  )
}

const IconLink = ({ size, name, href, children = null }) => (
  <Link href={href}>
    <a className="p-2 relative">
      <Icon size={size} name={name} />
      {children}
    </a>
  </Link>
)

export const Header = () => {
  const user = useSelector((state) => state.user.data)
  const router = useRouter()

  return (
    <header>
      <div className="p-4 border-b border-gray-light mb-6 flex md:hidden items-center">
        <SmallHeader router={router} />
      </div>
      <div className="z-30 items-center hidden w-full pt-4 md:flex select-none relative mb-4">
        <LargeHeader user={user} router={router} />
      </div>
    </header>
  )
}

export default Header
