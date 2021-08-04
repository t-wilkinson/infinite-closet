import React from 'react'

import Signin from '@/Account/Signin'
import { useDispatch } from '@/utils/store'
import { accountActions } from '@/Account/slice'

export const Page = () => {
  const dispatch = useDispatch()

  return (
    <>
      <Signin
        onSubmit={() => {
          dispatch(accountActions.hidePopup())
        }}
      />
      <span>
        New to Infinite Closet?{' '}
        <button onClick={() => dispatch(accountActions.showPopup('register'))}>
          <span className="cursor-pointer text-blue-500">
            Create an account
          </span>
          .
        </button>
      </span>
    </>
  )
}

export default Page
