import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import axios from '@/utils/axios'
import { useDispatch } from '@/utils/store'
import { userActions } from '@/User/slice'
import { useProtected } from '@/User/Protected'
import { CartUtils } from '@/Cart/slice'

export const User = ({ children }) => {
  const user = useProtected()

  if (user === undefined) {
    return null
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
export default User

const SideMenu = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const signout = () => {
    router.push('/')
    axios
      .post<void>('/account/signout', {})
      .then(() => {
        dispatch(userActions.signout())
        dispatch(CartUtils.count())
        dispatch(CartUtils.view())
      })
      .catch((err) => console.error(err))
  }

  return (
    <div className="h-full w-full mb-8 sm:mb-0 sm:w-64 bg-gray-light p-4 rounded-sm items-start">
      <SideLink active={/profile/.test(router.pathname)} href="/user/profile">
        Profile
      </SideLink>
      <SideLink
        active={/order-history/.test(router.pathname)}
        href="/user/order-history"
      >
        Order history
      </SideLink>
      <SideButton onClick={signout}>Sign out</SideButton>
    </div>
  )
}

const SideLink = ({ active, href, children }) => (
  <Link href={href}>
    <a className={`hover:underline ${active ? 'font-bold' : ''}`}>{children}</a>
  </Link>
)

const SideButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="hover:underline inline-block">
    {children}
  </button>
)
