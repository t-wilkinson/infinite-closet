import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { routes } from '@/utils/constants'

export const NavBar = () => {
  const [visible, setVisible] = React.useState<string>()

  return (
    <div
      className="relative items-center w-full pb-4"
      onMouseLeave={() => setVisible(null)}
    >
      <Sections visible={visible} setVisible={setVisible} />

      <div className="absolute bottom-0 w-full transform translate-y-full bg-gray-light">
        {routes.map((route, i) => (
          <div
            key={i}
            className={`flex-row p-10 ${
              route.value === visible ? 'flex' : 'hidden'
            }`}
          >
            <Image
              src={route.img ?? '/images/brand/Logo-Lockup---Gray.jpg'}
              height={350}
              width={350}
              objectFit="contain"
            />
            <PageRoutes route={route} />
          </div>
        ))}
      </div>
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
          className={`pb-4 -mb-4 ${
            visible === value ? 'bg-gray-light cursor-pointer' : undefined
          }`}
        >
          <Link href={href}>
            <span className="p-2 cursor-pointer md:text-base lg:text-lg">
              {label}
            </span>
          </Link>
        </div>
      ))}
    </div>
  </div>
)

const PageRoutes = ({ route }) => (
  <div className="flex-row">
    {route.data.map((column, i) => (
      <div key={i}>
        <span className="px-4 font-bold">
          <Link href={column.href}>
            <span className="p-1 font-bold cursor-pointer">{column.label}</span>
          </Link>
        </span>
        {column.data.map((row, i) => (
          <div key={i}>
            <span className="px-4">
              <Link href={row.href}>
                <span className="p-1 text-sm cursor-pointer hover:underline">
                  {row.label}
                </span>
              </Link>
            </span>
          </div>
        ))}
      </div>
    ))}
  </div>
)
