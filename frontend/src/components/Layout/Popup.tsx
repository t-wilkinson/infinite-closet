import React from 'react'

import { Icon } from '@/components'
import { iconClose } from '@/components/Icons'

const Popup = ({children, state=false, setState}) => {
  if (!state) {
    return null
  }

  return <aside className="fixed inset-0 grid place-items-center z-30"
    style={{ backgroundColor: "#5f6368cc" }}
    onClick={(e) => {
      // @ts-ignore
      if (e.target === e.currentTarget) {
        setState(false)
      }
    }}
  >
    <div
      className="bg-gray-light border-gray border w-96"
      style={{ maxHeight: 600 }}
    >
      <button onClick={() => setState(false)} className="place-self-end">
        <div className="p-4 pb-2">
          <Icon icon={iconClose} size={16} />
        </div>
      </button>
      {children}
    </div>
  </aside>
}

export default Popup

