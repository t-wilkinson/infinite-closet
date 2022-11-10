import React from 'react'

import { Icon, iconUp, iconDown } from '@/Components/Icons'

export const Drawer = ({label, size=0, children}) => {
  const [isOpen, setOpen] = React.useState(false)
  return <div>
    <button onClick={() => setOpen(!isOpen)} type="button">
      <div className="flex-row text-lg sm:text-sm items-center justify-between py-4">
        <span className="font-bold">
          {label}
          {size > 0 && ` (${size})`}
        </span>
        <Icon icon={isOpen ? iconUp : iconDown} size={12} />
      </div>
    </button>
    <div
      className={`py-4 px-2 text-lg sm:text-sm ${
        isOpen ? 'flex' : 'hidden'
      }`}
    >
      {children}
    </div>
  </div>

}

export default Drawer
