import React from 'react'
import dynamic from 'next/dynamic'

import { rootActions } from '@/slice'
import { useDispatch } from '@/utils/store'
import { Popup as PopupWrapper } from '@/Layout/Popup'

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
    <PopupWrapper
      isOpen={popup !== 'hidden'}
      close={() => dispatch(rootActions.hidePopup())}
      spacing
    >
      <PopupForm />
    </PopupWrapper>
  )
}

export default Popup
