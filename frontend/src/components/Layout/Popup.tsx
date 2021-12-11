import React from 'react'

import Modal from './Modal'
import { Icon, iconClose } from '@/Icons'

const Popup = ({
  children,
  header = undefined,
  isOpen = true,
  close = () => {},
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <Modal close={close}>
      <div className="bg-white w-96 p-4 rounded-md" style={{ maxHeight: 600 }}>
        <button
          type="button"
          onClick={() => close()}
          className="place-self-end absolute pb-2 pl-2"
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
