import React from 'react'

import { OR } from '@/Form'
import Register from '@/Form/Register'
import { rootActions } from '@/slice'
import { useDispatch, useSelector } from '@/utils/store'

export const PopupRegister = () => {
  const dispatch = useDispatch()
  const email = useSelector((state) => state.root.email)
  const name = useSelector((state) => state.root.name)
  const firstName = (name || '').split(' ')[0] || ''
  const lastName = (name || '').split(' ')[1] || ''

  return (
    <>
      <Register
        email={email}
        firstName={firstName}
        lastName={lastName}
        onSubmit={() => {
          dispatch(rootActions.hidePopup())
        }}
      />
      <OR />
      <span>
        Already have an account?{' '}
        <button onClick={() => dispatch(rootActions.showPopup('signin'))}>
          <span className="cursor-pointer text-blue-500">Sign In</span>.
        </button>
      </span>
    </>
  )
}

export default PopupRegister
