import React from 'react'

import Signin from '@/Form/Signin'
import { useDispatch } from '@/utils/store'
import { rootActions } from '@/slice'

export const PopupSignin = () => {
  const dispatch = useDispatch()

  return (
    <>
      <Signin
        onSubmit={() => {
          dispatch(rootActions.hidePopup())
        }}
      />
      <span>
        New to Infinite Closet?{' '}
        <button onClick={() => dispatch(rootActions.showPopup('register'))}>
          <span className="cursor-pointer text-blue-500">
            Create an account
          </span>
          .
        </button>
      </span>
    </>
  )
}

export default PopupSignin
