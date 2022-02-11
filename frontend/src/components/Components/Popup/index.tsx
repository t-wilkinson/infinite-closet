import React from 'react'
import dynamic from 'next/dynamic'

import { rootActions } from '@/slice'
import { useDispatch } from '@/utils/store'
import { Icon, iconClose } from '@/Components/Icons'

const PopupRegister = dynamic(() => import('./Register'))
const PopupSignin = dynamic(() => import('./Signin'))
// const PopupJoinWaitlist = dynamic(() => import('./JoinWaitlist'))
const PopupEmail = dynamic(() => import('./Email'))

const popups = {
  hidden: () => null,
  // waitlist: PopupJoinWaitlist,
  email: PopupEmail,
  register: PopupRegister,
  signin: PopupSignin,
}

export const Popup = ({ popup }) => {
  const dispatch = useDispatch()
  const PopupForm = popups[popup]

  return (
    <div
      className={`
      fixed inset-0 z-40 bg-black bg-opacity-70 pt-20
      ${popup === 'hidden' ? 'hidden' : ''}
    `}
      onClick={() => dispatch(rootActions.hidePopup())}
    >
      <button
        className="absolute top-0 right-0 m-4 z-20"
        onClick={() => dispatch(rootActions.hidePopup())}
        type="button"
      >
        <Icon icon={iconClose} size={20} />
      </button>
      <div className="h-3" />
      <PopupForm />
    </div>
  )
}

export default Popup
