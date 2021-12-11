import React from 'react'

const Modal = ({ children, close = () => {} }) => {
  return (
    <aside
      className="fixed inset-0 grid place-items-center z-30"
      style={{ backgroundColor: '#5f6368cc' }}
      onClick={(e) => {
        // @ts-ignore
        if (e.target === e.currentTarget) {
          close()
        }
      }}
    >
      {children}
    </aside>
  )
}

export default Modal
