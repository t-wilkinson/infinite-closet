import React from 'react'
import { useDispatch } from '@/utils/store'
import { accountActions } from '@/Account/slice'

export const Banner = () => {
  const dispatch = useDispatch()
  return (
    <div className="items-center px-2 py-1 bg-sec text-white flex-row w-full justify-center">
      <button
        onClick={() => {
          dispatch(accountActions.showPopup('email'))
        }}
      >
        Get 10% off your first rental when you join our mailing list
      </button>
    </div>
  )
}

export default Banner
