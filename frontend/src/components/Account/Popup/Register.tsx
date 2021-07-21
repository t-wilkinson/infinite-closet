import React from 'react'

import { Icon } from '@/components'
import { OR } from '@/Form'
import Register from '@/Account/Register'
import { accountActions } from '@/Account/slice'
import { useDispatch, useSelector } from '@/utils/store'

export const PopupRegister = () => {
  const dispatch = useDispatch()
  const email = useSelector((state) => state.account.email)

  return (
    <>
      <Register email={email} />
      <OR />
      <span>
        <button onClick={() => dispatch(accountActions.showPopup('email'))}>
          <span className="flex cursor-pointer text-blue-500 items-center">
            <Icon name="left" size={10} />
            <div className="w-1" />
            Go Back
          </span>
        </button>
      </span>
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
