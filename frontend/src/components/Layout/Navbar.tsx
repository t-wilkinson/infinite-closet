import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import axios from '@/utils/axios'
import { StrapiCategory } from '@/types/models'
import { routes } from '@/utils/config'

// TODO: use nextjs caching
const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
  // return `https://infinitecloset.treywilkinson.com/_next/image?url=${encodeURIComponent(
  //   src,
  // )}&w=${width}&q=${quality || 75}`
}

export const NavBar = () => {
  const [visible, setVisible] = React.useState<string>()
  const [serverRoutes, setServerRoutes] = React.useState([])

  React.useEffect(() => {
    axios
      .get('/products/routes', {withCredentials: false})
      .then((data) => setServerRoutes(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div
      className="items-center w-full relative z-30"
      onMouseLeave={() => setVisible(null)}
    >
      <Sections
        visible={visible}
        setVisible={setVisible}
        serverRoutes={serverRoutes}
      />
      {/* {visible && <div className="h-px bg-pri-light w-full mt-2 z-10" />} */}
    </div>
  )
}
export default NavBar

const Sections = ({ visible, setVisible, serverRoutes }) => (
  <div className="items-center justify-center w-full">
    <nav className="flex flex-row justify-center space-x-8 relative w-full">
      {routes.map((route, i) => (
        <div key={route.value + i}>
          <SectionsRoute
            route={route}
            visible={visible}
            setVisible={setVisible}
          />
          <SectionsContent
            route={route}
            visible={visible}
            serverRoutes={serverRoutes}
          />
        </div>
      ))}
    </nav>
  </div>
)

const SectionsRoute = ({ route, visible, setVisible }) => (
  <div
    onMouseEnter={() => setVisible(route.value)}
    onFocus={() => setVisible(route.value)}
    className={` relative justify-center
      ${visible === route.value ? 'bg-pri-light' : ''}
      `}
  >
    {/* {visible === route.value && ( */}
    {/*   <div className="absolute w-full bottom-0 h-1 bg-pri" /> */}
    {/* )} */}
    {
      <Link href={route.href ?? '#'}>
        <a>
          <span className="p-2 cursor-pointer font-subheader">
            {route.label}
          </span>
        </a>
      </Link>
    }
  </div>
)

const SectionsContent = ({ route, visible, serverRoutes }) => {
  const selected =
    route.value === visible && !['blogs', 'designers'].includes(route.value)

  return (
    <div
      className={`absolute top-0 left-0 w-full transform bg-white mt-6 items-center p-8
      ${selected ? 'visible' : 'invisible'}
      `}
      style={{
        boxShadow: '0 20px 20px rgb(0 0 0 / 20%)',
      }}
    >
      {
        <div
          className="absolute left-0 h-px bg-pri w-full top-0 z-10"
          style={{
            marginTop: 0,
          }}
        />
      }

      <div className="w-full max-w-screen-xl flex-row">
        {route.img && (
          <Image
            loader={myLoader}
            alt={`${route.label} page`}
            src={`/media/header/${route.img}`}
            height={350}
            width={350}
            objectFit="contain"
          />
        )}

        <div key={route.value}>
          <PageRoutes route={route} serverRoutes={serverRoutes} />
        </div>
      </div>

      {
        <div
          className="absolute left-0 h-px bg-pri right-0 bottom-0 z-10"
          style={{
            marginTop: 5,
          }}
        />
      }
    </div>
  )
}

const PageRoutes = ({
  route,
  serverRoutes,
}: {
  route: typeof routes[number]
  serverRoutes: { [key: string]: StrapiCategory }
}) => {
  return (
    <div className="flex-row">
      {route.data.map((column, i) => (
        <div key={i}>
          {column.label && (
            <ColumnHeader href={column.href}>{column.label}</ColumnHeader>
          )}
          <PageColumnItems column={column} serverRoutes={serverRoutes} />
        </div>
      ))}
    </div>
  )
}

const sortRoute = (r1, r2) => {
  const s1 = r1.slug
  const s2 = r2.slug
  const alphabeticalOrder =
    r1.name < r2.name ? -1 : r1.name > r2.name ? 1 : 0
  if (s1 === null && s2 === null) {
    return alphabeticalOrder
  } else if (s1 !== null && s2 !== null) {
    return alphabeticalOrder
  } else if (s1 === null) {
    return 1
  } else {
    return -1
  }
}

const rowToHref = (column, row) => ({
      ...row,
      href:
        row.slug === null
          ? null
          : column.type === 'slug'
          ? `${column.href}/${row.slug}`
          : column.type === 'href'
          ? `${column.href}${row.slug}`
          : column.type === 'query'
          ? `${column.href}?${column.value}=${row.slug}`
          : null,
    })

export const toRows = (column, serverRoutes) => {
  const defaultRoutes = serverRoutes.routes?.[column.value]?.categories || []
  const serverRows =
    (column.value === 'occasions' ? serverRoutes.occasions : defaultRoutes) ||
    []

  const rows = (
    column.data.reduce((acc, row) => {
      if (row.slug === undefined) {
        row.slug === null
      }
      if (column.value !== 'occasions' && !serverRoutes.routes?.[column.value]) {
        acc = [...acc, row]
      } else if (serverRows.every((r) => r.slug !== row.slug)) {
        row.slug = null
        acc = [...acc, row]
      }
      return acc
    }, serverRows) || column.data
  )
    .sort(sortRoute)
    .map((row) => rowToHref(column, row))

  return rows
}

const PageColumnItems = ({ column, serverRoutes }) => {
  const rows = toRows(column, serverRoutes)

  return rows.map((row, i) => (
    <ColumnItem key={row.name + row.slug + row.href} href={row.href}>
      {row.name}
    </ColumnItem>
  ))
}

const ColumnHeader = ({ href, children }) => (
  <span className="px-4 font-bold">
    <Link href={href ?? '#'}>
      <a>
        <span
          className={`p-1 font-bold
          ${href ? 'hover:underline' : 'cursor-default text-gray-500'}
          `}
        >
          {children}
        </span>
      </a>
    </Link>
  </span>
)

const ColumnItem = ({ href, children }) => (
  <span className="px-4">
    {href ? (
      <Link href={href}>
        <a>
          <span className="p-1 text-sm hover:underline">{children}</span>
        </a>
      </Link>
    ) : (
      <span className="p-1 text-sm cursor-default text-gray-500">
        {children}
      </span>
    )}
  </span>
)
