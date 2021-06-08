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
      {visible && <div className="h-px bg-pri w-full -mt-px z-10" />}
      <div
        className={`absolute bottom-0 w-full transform translate-y-full bg-white items-center shadow-xl
        `}
      >
        {routes.map(
          (route) =>
            route.value !== 'blog' && (
              <div
                key={route.value}
                className={`flex-row w-full max-w-screen-xl p-4
            ${route.value === visible ? '' : 'hidden'}
            `}
              >
                <Image
                  loader={myLoader}
                  alt={`${route.label} page`}
                  src={
                    `/images/header/${route.img}` ??
                    '/images/brand/Logo-Lockup---Gray.jpg'
                  }
                  height={350}
                  width={350}
                  objectFit="contain"
                />
                <PageRoutes route={route} />
              </div>
            ),
        )}
      </div>
    </div>
  )
}
export default NavBar

const Sections = ({ visible, setVisible }) => (
  <div className="items-center justify-center max-w-screen-xl w-full">
    <div className="flex-row w-full justify-around">
      {routes.map(({ value, label, href }, i) => (
        <div
          key={i}
          onMouseEnter={() => setVisible(value)}
          className={` relative justify-center
            ${value == 'blog' ? '' : visible === value ? 'bg-pri-light' : ''}
          `}
        >
          {value == 'blog' ? (
            <div>
              <span className="p-2 text-gray font-subheader">{label}</span>
            </div>
          ) : (
            <Link href={href ?? '#'}>
              <a>
                <span className="p-2 cursor-pointer font-subheader">
                  {label}
                </span>
              </a>
            </Link>
          )}
        </div>
      ))}
    </div>
  </div>
)

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
