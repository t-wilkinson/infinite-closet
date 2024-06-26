import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Button } from '@/Components'
import { useDispatch, useSelector } from '@/utils/store'
import { Icon, iconMenu, iconShoppingBag, iconUser, iconWardrobe } from '@/Components/Icons'

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
          <Icon icon={iconMenu} size={32} />
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
  <>
    <div
      className={`w-full justify-center h-32
     ${router.pathname === '/' ? 'my-4' : ''} `}
    >
      {user && <div className="absolute right-0 top-0 p-1">
        {user.email}
      </div>}
      <div className="relative justify-between items-center">
        <LargeHeaderLogo router={router} />
        <div className="absolute xl:bottom-0 right-0 -mb-1 mt-0 mr-4 z-20">
          <Account user={user} />
        </div>
        <div className="realtive w-full mt-2 relative z-10">
          <Navbar />
        </div>
      </div>
    </div>
    <div className="w-full h-px bg-pri" />
  </>
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
  const count = useSelector((state) => state.orders.count)
  const [hover, setHover] = React.useState(false)

  if (user) {
    return (
      <div className="flex-row items-center">
        <IconLink href="/user/profile" size={18} icon={iconUser} />
        {/* <IconLink href="/user/saved" size={18} name="heart" /> */}
        <IconLink href="/buy" size={18} icon={iconShoppingBag}>
          {count > 0 && (
            <span className="absolute right-0 bottom-0 text-xs bg-sec-light rounded-full px-1">
              {count}
            </span>
          )}
        </IconLink>
        <div className="relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
          <IconLink href="/wardrobes" size={18} icon={iconWardrobe} />
          {hover && (
            <div className="absolute top-0 right-0 bg-white rounded-md border border-gray-light"
              style={{marginTop: 30}}
            >
              {[
                { href: '/wardrobes', name: 'Wardrobes' },
                { href: '/wardrobes/my-wardrobe', name: 'My Wardrobes' },
                { href: '/wardrobes/edit', name: 'Edit Wardrobes' },
                { href: '/wardrobes/upload', name: 'Upload Item' },
              ].map((item, i) => (
                <React.Fragment key={item.name}>
                  {i > 0 && <div className="h-px bg-gray-light" />}
                <Link href={item.href}>
                  <a className="inline-block px-2 py-1" style={{ whiteSpace: 'nowrap'}}>
                    {item.name}
                  </a>
                </Link>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

      </div>
    )
  } else {
    return (
      <div className="flex-row items-center space-x-3">
        <IconLink href="/buy" size={18} icon={iconShoppingBag}>
          {count > 0 && (
            <span className="absolute right-0 bottom-0 text-xs bg-sec-light rounded-full px-1">
              {count}
            </span>
          )}
        </IconLink>
        <Link href="/account/signin">
          <a>
            <span>Sign in</span>
          </a>
        </Link>
        <Link href="/account/register">
          <a>
            <Button role="secondary">Get Started</Button>
          </a>
        </Link>
        {/* <IconLink href="/user/saved" size={18} name="heart" /> */}
        {/* <IconLink href="/buy" size={18} name="shopping-bag" /> */}
      </div>
    )
  }
}

const IconLink = ({ size, name = null, icon, href, children = null }) => (
  <Link href={href}>
    <a className="p-2 relative">
      <Icon size={size} icon={icon} />
      {children}
    </a>
  </Link>
)

export const Header = ({}) => {
  const user = useSelector((state) => state.user.data)
  const router = useRouter()

  return (
    <header>
      <div className="p-4 border-b border-gray-light flex md:hidden items-center">
        <SmallHeader router={router} />
      </div>
      <div
        className={`z-30 items-center hidden w-full md:flex select-none relative
        `}
      >
        <LargeHeader user={user} router={router} />
      </div>
    </header>
  )
}

export default Header
