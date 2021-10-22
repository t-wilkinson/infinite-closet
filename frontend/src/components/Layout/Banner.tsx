import React from 'react'

import { useDispatch } from '@/utils/store'
import { accountActions } from '@/Account/slice'
import * as storage from '@/utils/storage'

export const Banner = () => {
  const dispatch = useDispatch()
  return (
    <div className="items-center px-2 py-1 bg-sec text-white flex-row w-full justify-center">
      <button
        onClick={() => {
          dispatch(accountActions.showPopup('email'))
          storage.session.set('popup-form', true)
        }}
      >
        {/* Get 10% off your first rental when you join our mailing list */}
        Rent your holiday looks by selecting a 4 day rental for Dec 22 and keep
        your outfits until Jan 4. Our gift to you!
      </button>
    </div>
  )
}

export default Banner
