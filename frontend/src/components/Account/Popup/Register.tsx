import React from 'react'

import { OR } from '@/Form'
import Register from '@/Account/Register'
import { accountActions } from '@/Account/slice'
import { useDispatch } from '@/utils/store'

export const PopupRegister = () => {
  const dispatch = useDispatch()

  return (
    <>
      <Register />
      <div className="my-4">
        <OR />
      </div>
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
