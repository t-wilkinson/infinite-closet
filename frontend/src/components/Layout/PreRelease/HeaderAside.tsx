import React from 'react'
import Link from 'next/link'

import { routes } from '@/utils/constants'
import { useDispatch, useSelector } from '@/utils/store'
import { Icon, Divider } from '@/components'

import { layoutActions } from '../slice'

const HeaderAside = () => {
  const dispatch = useDispatch()
  const [focused, setFocused] = React.useState<string>()
  const headerOpen = useSelector((state) => state.layout.headerOpen)

  return (
    headerOpen && (
      <div className="fixed inset-0 bg-white z-20 border-b border-gray-light">
        <div className="w-full h-full overflow-auto">
          <div className="w-full flex-row items-center justify-between p-4">
            <Link href="/">
              <a>
                <span className="font-header">INFINITE CLOSET</span>
              </a>
            </Link>
            <button onClick={() => dispatch(layoutActions.toggleHeader())}>
              <Icon name="close" size={16} />
            </button>
          </div>

          <Divider />

          {routes.map((section, i) => (
            <div key={section.value + '' + i}>
              <RouteHeader
                key={section.value + '' + i}
                setFocused={setFocused}
                focused={focused}
                section={section}
              />
              {section.data[0].data.map((v: any, i: number) => (
                <RouteContents
                  key={v.label + '' + i}
                  focused={focused}
                  section={section}
                  item={v}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  )
}
export default HeaderAside

const RouteHeader = ({ setFocused, focused, section }) => {
  return (
    <button
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
        <Icon name={focused === section.value ? 'down' : 'up'} size={12} />
      </div>
    </button>
  )
}

const RouteContents = ({ focused, item, section }) => (
  <div
    className={`bg-gray-light items-start
      ${focused === section.value ? '' : 'hidden'}
      `}
  >
    <Link href={item.href ?? '#'}>
      <a
        className={`px-4 my-1 py-1
          ${item.href ? 'hover:underline' : 'cursor-default text-gray-700'}
        `}
      >
        <span>{item.label}</span>
      </a>
    </Link>
  </div>
)