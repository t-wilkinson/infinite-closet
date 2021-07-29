import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'

import { StrapiCategory } from '@/utils/models'
import { routes } from '@/utils/constants'

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

  //   React.useEffect(() => {
  //     Promise.all(routes.map((route) => fetch(`/media/header/${route.img}`)))
  //   }, [])

  React.useEffect(() => {
    axios
      .get('/products/routes')
      .then((res) => setServerRoutes(res.data))
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
      {visible && <div className="h-px bg-pri-light w-full -mt-px z-10" />}
    </div>
  )
}
export default NavBar

const Sections = ({ visible, setVisible, serverRoutes }) => (
  <div className="items-center justify-center max-w-screen-xl w-full">
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
  const selected = route.value === visible && route.value !== 'blogs'

  return (
    <div
      className={`absolute top-0 left-0 w-full transform bg-white mt-6 flex-row p-4 shadow-xl
      ${selected ? 'visible' : 'invisible'}
      `}
    >
      <Image
        loader={myLoader}
        alt={`${route.label} page`}
        src={`/media/header/${route.img}`}
        height={350}
        width={350}
        objectFit="contain"
      />

      <div key={route.value}>
        <PageRoutes route={route} serverRoutes={serverRoutes} />
      </div>
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

// TODO: the logic is kind of a mess
export const toRows = (column, serverRoutes) => {
  const defaultRoutes =
    (serverRoutes.routes &&
      serverRoutes.routes[column.value] &&
      serverRoutes.routes[column.value].categories) ||
    []

  const serverRows =
    (column.value === 'occasions' ? serverRoutes.occasions : defaultRoutes) ||
    []

  const rows = (
    column.data.reduce((acc, row) => {
      if (row.slug === undefined) {
        row.slug === null
      }
      if (
        column.value !== 'occasions' &&
        !(serverRoutes.routes && serverRoutes.routes[column.value])
      ) {
        acc = [...acc, row]
      } else if (serverRows.every((r) => r.slug !== row.slug)) {
        row.slug = null
        acc = [...acc, row]
      }
      return acc
    }, serverRows) || column.data
  )
    .sort((r1, r2) => {
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
    })
    .map((row) => ({
      ...row,
      href:
        row.slug === null
          ? null
          : column.type === 'slug'
          ? `${column.href}/${row.slug}`
          : column.type === 'query'
          ? `${column.href}?${column.value}=${row.slug}`
          : column.type === 'href'
          ? `${column.href}/${row.slug}`
          : null,
    }))

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
          ${href ? 'hover:underline' : 'cursor-default text-gray-700'}
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
      <span className="p-1 text-sm cursor-default text-gray-700">
        {children}
      </span>
    )}
  </span>
)
