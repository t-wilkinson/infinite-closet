/**
 * @file Modal with more presentational components like header
 */
import React from 'react'

import Modal from './Modal'
import { Icon, iconClose } from '@/Components/Icons'

export const Popup = ({
  children,
  header = undefined,
  isOpen = true,
  close = () => {},
  spacing=false,
  className="",
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <Modal close={close}>
      <div className={`bg-white p-4 rounded-md ${className || 'w-96' }`} style={{ maxHeight: 600 }}>
        {spacing && <div className="h-8" />}
        <button
          type="button"
          onClick={close}
          className="place-self-end absolute p-1"
        >
          <Icon icon={iconClose} size={16} />
        </button>
        {header && (
          <>
            <h3 className="font-bold text-3xl mt-2 text-center">{header}</h3>
            <div className="w-full h-px bg-pri mb-8 mt-1 rounded-full" />
          </>
        )}

        {children}
      </div>
    </Modal>
  )
}

export default Popup
