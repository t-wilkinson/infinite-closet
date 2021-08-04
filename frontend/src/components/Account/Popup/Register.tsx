import React from 'react'

import { OR } from '@/Form'
import Register from '@/Account/Register'
import { accountActions } from '@/Account/slice'
import { useDispatch, useSelector } from '@/utils/store'

export const PopupRegister = () => {
  const dispatch = useDispatch()
  const email = useSelector((state) => state.account.email)
  const name = useSelector((state) => state.account.name)
  const firstName = name.split(' ')[0] || ''
  const lastName = name.split(' ')[1] || ''

  return (
    <>
      <Register
        email={email}
        firstName={firstName}
        lastName={lastName}
        onSubmit={() => {
          dispatch(accountActions.hidePopup())
        }}
      />
      <OR />
      <span>
        Already have an account?{' '}
        <button onClick={() => dispatch(accountActions.showPopup('signin'))}>
          <span className="cursor-pointer text-blue-500">Sign In</span>.
        </button>
      </span>
    </>
  )
}

export default PopupRegister
