import React from 'react'
import Link from 'next/link'
import axios from 'axios'

export const User = ({ children }) => {
  return (
    <div className="w-full items-center px-4 xl:px-0 mb-4">
      <div className="max-w-screen-xl sm:flex-row w-full">
        <SideMenu />
        <div className="w-4" />
        <div className="w-full mx-2 sm:mx-4 lg:mx-8">{children}</div>
      </div>
    </div>
  )
}
export default User

const SideMenu = () => (
  <div className="w-full mb-8 sm:mb-0 sm:w-64 bg-gray-light p-4 rounded-sm items-start">
    <SideLink href="/user/profile">Profile</SideLink>
    <SideButton
      onClick={() => {
        axios
          .post('/account/logout', {}, { withCredentials: true })
          .then((res) => {
            window.location.href = '/'
          })
          .catch((err) => console.error(err))
      }}
    >
      Logout
    </SideButton>
  </div>
)

const SideLink = ({ href, children }) => (
  <Link href={href}>
    <a>{children}</a>
  </Link>
)

const SideButton = ({ onClick, children }) => (
  <button onClick={onClick} className="inline-block">
    {children}
  </button>
)
