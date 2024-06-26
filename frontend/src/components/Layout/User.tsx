import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useDispatch, useSelector } from '@/utils/store'
import { ButtonLink } from '@/Components'
import Layout from '@/Layout'
import { signout } from '@/User'

export const User = ({ children, allowGuest = false, ...layoutProps}) => {
  return <Layout {...layoutProps}>
    <UserContent children={children} allowGuest={allowGuest} />
  </Layout>
}

const UserContent = ({ children, allowGuest = false }) => {
  const user = useSelector((state) => state.user.data)

  if (user === undefined) {
    return null
  }

  const isGuest = user === null

  if (isGuest && !allowGuest) {
    return (
      <div className="h-full w-full items-center px-4 xl:px-0 mb-4">
        <div className="h-full max-w-screen-xl w-full items-center justify-center h-full space-y-4">
          <h3 className="text-xl font-bold">
            Looks like you need to be logged in to access this page.
          </h3>
          <ButtonLink href="/account/signin">Sign In</ButtonLink>
        </div>
      </div>
    )
  }

  if (isGuest && allowGuest) {
    return children
  }

  return (
    <div className="h-full w-full items-center px-4 xl:px-0 mb-4">
      <div className="h-full max-w-screen-xl sm:flex-row w-full">
        <SideMenu />
        <div className="w-4" />
        <div className="w-full mx-2 sm:mx-4 lg:mx-8">{children}</div>
      </div>
    </div>
  )
}

const SideMenu = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  return (
    <div className="h-full w-full mb-8 sm:mb-0 sm:w-64 p-4 rounded-sm items-start border-r border-gray">
      <SideLink href="/user/profile">Profile</SideLink>
      <SideLink href="/user/favorites">Favorites</SideLink>
      <SideLink href="/user/giftcard">Gift cards</SideLink>
      <SideLink href="/user/order-history">Order history</SideLink>
      <SideButton
        onClick={() => {
          router.push('/')
          signout(dispatch)
        }}
      >
        Sign out
      </SideButton>
    </div>
  )
}

const SideLink = ({ href, children }) => {
  const router = useRouter()
  const active = new RegExp(href, 'i').test(router.pathname)
  return (
    <Link href={href}>
      <a className={`hover:underline ${active ? 'font-bold' : ''}`}>
        {children}
      </a>
    </Link>
  )
}

const SideButton = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="hover:underline inline-block"
  >
    {children}
  </button>
)

export default User
