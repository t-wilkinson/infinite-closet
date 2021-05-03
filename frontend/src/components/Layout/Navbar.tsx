import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Divider } from '@/components'
import { routes } from '@/utils/constants'

export const NavBar = () => {
  const [visible, setVisible] = React.useState<string>()

  return (
    <div
      className="items-center w-full relative"
      onMouseLeave={() => setVisible(null)}
    >
      <Sections visible={visible} setVisible={setVisible} />
      <Divider className="max-w-screen-xl" />

      {visible && (
        <div className="absolute bottom-0 w-full transform translate-y-full bg-white items-center p-4 shadow-xl">
          {routes.map(
            (route, i) =>
              route.value === visible && (
                <div key={i} className="flex-row w-full max-w-screen-xl">
                  <Image
                    src={route.img ?? '/images/brand/Logo-Lockup---Gray.jpg'}
                    height={350}
                    width={350}
                    objectFit="contain"
                  />
                  <PageRoutes route={route} />
                </div>
              ),
          )}
        </div>
      )}
    </div>
  )
}
export default NavBar

const Sections = ({ visible, setVisible }) => (
  <div className="items-center justify-center w-full">
    <div className="flex-row space-x-2">
      {routes.map(({ value, label, href }, i) => (
        <div
          key={i}
          onMouseEnter={() => setVisible(value)}
          className={`
            ${visible === value ? 'bg-gray-light cursor-pointer' : ''}
          `}
        >
          <Link href={href ?? '#'}>
            <span className="p-2 cursor-pointer md:text-base lg:text-lg font-subheader">
              {label}
            </span>
          </Link>
        </div>
      ))}
    </div>
  </div>
)

const PageRoutes = ({ route }: { route: typeof routes[number] }) => (
  <div className="flex-row">
    {route.data.map((column, i) => (
      <div key={i}>
        <span className="px-4 font-bold">
          <Link href={column.href ?? '#'}>
            <span className={`p-1 font-bold ${dne(column.href)} `}>
              {column.label}
            </span>
          </Link>
        </span>
        {column.data.map((row, i) => (
          <div key={i}>
            <span className="px-4">
              <Link href={row.href ?? '#'}>
                <span className={`p-1 text-sm ${dne(row.href)} `}>
                  {' '}
                  {row.label}{' '}
                </span>
              </Link>
            </span>
          </div>
        ))}
      </div>
    ))}
  </div>
)
const dne = (href?: string) =>
  href ? 'cursor-pointer hover:underline' : 'text-gray-700'
