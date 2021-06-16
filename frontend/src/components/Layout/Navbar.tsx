import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { routes } from '@/utils/constants'

// TODO: use nextjs caching
const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

export const NavBar = () => {
  const [visible, setVisible] = React.useState<string>()

  return (
    <div
      className="items-center w-full relative z-30"
      onMouseLeave={() => setVisible(null)}
    >
      <Sections visible={visible} setVisible={setVisible} />
      {visible && <div className="h-px bg-pri-light w-full -mt-px z-10" />}
    </div>
  )
}
export default NavBar

const Sections = ({ visible, setVisible }) => (
  <div className="items-center justify-center max-w-screen-xl w-full">
    <nav className="flex flex-row w-full justify-around relative">
      {routes.map((route, i) => (
        <div key={route.value + i}>
          <SectionsRoute
            route={route}
            visible={visible}
            setVisible={setVisible}
          />
          <SectionsContent route={route} visible={visible} />
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

const SectionsContent = ({ route, visible }) => {
  const selected = route.value === visible && route.value !== 'blogs'

  if (!selected) {
    return null
  }

  return (
    <div className="absolute top-0 left-0 w-full transform bg-white mt-6 flex-row p-4 shadow-xl">
      <Image
        loader={myLoader}
        alt={`${route.label} page`}
        src={`/media/header/${route.img}`}
        height={350}
        width={350}
        objectFit="contain"
      />

      <div key={route.value}>
        <PageRoutes route={route} />
      </div>
    </div>
  )
}

const PageRoutes = ({ route }: { route: typeof routes[number] }) => (
  <div className="flex-row">
    {route.data.map((column, i) => (
      <div key={i}>
        {column.label && (
          <ColumnHeader href={column.href}>{column.label}</ColumnHeader>
        )}
        {column.data.map((row, i) => (
          <ColumnItem key={i} href={row.href}>
            {row.label}
          </ColumnItem>
        ))}
      </div>
    ))}
  </div>
)

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
    <Link href={href ?? '#'}>
      <a>
        <span
          className={`p-1 text-sm
        ${href ? 'hover:underline' : 'cursor-default text-gray-700'}
        `}
        >
          {children}
        </span>
      </a>
    </Link>
  </span>
)
