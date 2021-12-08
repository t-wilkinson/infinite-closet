import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import axios from '@/utils/axios'
import { routes } from '@/utils/config'
import { useDispatch, useSelector } from '@/utils/store'
import { Icon, Divider } from '@/components'
import { toRows } from '@/Layout/Navbar'
import { iconDown, iconUp } from '@/components/Icons'

import { layoutActions } from './slice'
import { iconClose } from '@/components/Icons'

const HeaderAside = () => {
  const dispatch = useDispatch()
  const [focused, setFocused] = React.useState<string>()
  const [serverRoutes, setServerRoutes] = React.useState([])
  const headerOpen = useSelector((state) => state.layout.headerOpen)
  const user = useSelector((state) => state.user.data)

  React.useEffect(() => {
    axios
      .get('/products/routes', { withCredentials: false })
      .then((data) => setServerRoutes(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    headerOpen && (
      <aside className="fixed inset-0 bg-white z-30 border-b border-gray-light">
        <div className="w-full h-full overflow-auto">
          <Header dispatch={dispatch} />
          <Divider />
          <Routes
            focused={focused}
            setFocused={setFocused}
            dispatch={dispatch}
            serverRoutes={serverRoutes}
          />

          <Divider className="my-2" />
          {user ? (
            <>
              <AsideLink href="/user/profile" label="My Account" />
              <AsideLink href="/user/checkout" label="Checkout" />
            </>
          ) : (
            <>
              <AsideLink href="/account/signin" label="Sign In" />
              <AsideLink href="/account/register" label="Register" />
            </>
          )}
          <AsideLink href="/about-us" label="About Us" />
          <AsideLink href="/faqs" label="Help" />
          <Divider className="my-2" />
        </div>
      </aside>
    )
  )
}
export default HeaderAside

const Header = ({ dispatch }) => (
  <div className="w-full flex-row items-center justify-between">
    <Link href="/">
      <a
        className="p-4"
        onClick={() => {
          dispatch(layoutActions.closeHeader())
        }}
      >
        <span className="font-header text-xl">INFINITE CLOSET</span>
      </a>
    </Link>
    <button
      onClick={() => dispatch(layoutActions.toggleHeader())}
      aria-label="Toggle side navigation"
      className="p-3"
    >
      <Icon icon={iconClose} size={24} />
    </button>
  </div>
)

const Routes = ({ serverRoutes, dispatch, setFocused, focused }) => (
  <>
    {routes.map((section, i) => (
      <div key={section.value + '' + i}>
        <RouteHeader
          dispatch={dispatch}
          setFocused={setFocused}
          focused={focused}
          section={section}
        />
        <RouteColumn
          section={section}
          dispatch={dispatch}
          focused={focused}
          serverRoutes={serverRoutes}
        />
      </div>
    ))}
  </>
)

const RouteColumn = ({ dispatch, focused, section, serverRoutes }) =>
  section.data.map((column) => (
    <React.Fragment key={section.value + column.value}>
      {column.href && (
        <span className="font-bold">
          <RouteContents
            dispatch={dispatch}
            focused={focused}
            section={section}
            item={{ name: column.label, href: column.href }}
          />
        </span>
      )}
      {toRows(column, serverRoutes)
        .slice(0, 15)
        .map(
          (v: any, i: number) =>
            (!['clothing', 'accessories'].includes(section.value) ||
              v.href) && (
              <RouteContents
                key={v.name + v.slug + v.href}
                dispatch={dispatch}
                focused={focused}
                section={section}
                item={v}
              />
            )
        )}
    </React.Fragment>
  ))

const AsideLink = ({ href, label }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  return (
    <button
      aria-label="Close side navigation"
      className="flex items-start"
      onClick={() => {
        dispatch(layoutActions.closeHeader())
        router.push(href)
      }}
    >
      <span className="uppercase px-4 my-1 py-1 cursor-pointer">{label}</span>
    </button>
  )
}

const RouteHeader = ({ setFocused, focused, section, dispatch }) => {
  if (['blogs', 'designers'].includes(section.value)) {
    return (
      <Link href={section.href}>
        <a
          className="p-4 items-center justify-between flex-row"
          onClick={() => dispatch(layoutActions.closeHeader())}
        >
          <span className={`uppercase`}>{section.label}</span>
        </a>
      </Link>
    )
  }

  return (
    <button
      aria-label="Toggle aside menu sub routes"
      className="outline-none"
      onClick={() =>
        setFocused(focused === section.value ? null : section.value)
      }
    >
      <div className="flex-row justify-between p-4 items-center">
        <span
          className={`uppercase
          ${focused === section.value ? 'body-bold' : 'body'}
          `}
        >
          {section.label}
        </span>
        <Icon icon={focused === section.value ? iconDown : iconUp} size={12} />
      </div>
    </button>
  )
}

const RouteContents = ({ dispatch, focused, item, section }) => (
  <div
    className={`bg-gray-light items-start
      ${focused === section.value ? '' : 'hidden'}
      `}
  >
    <Link href={item.href ?? '#'}>
      <a
        onClick={() => dispatch(layoutActions.closeHeader())}
        className={`px-4 my-1 py-1 block w-full
          ${item.href ? 'hover:underline' : 'cursor-default text-gray-500'}
        `}
      >
        <span>{item.name}</span>
      </a>
    </Link>
  </div>
)
