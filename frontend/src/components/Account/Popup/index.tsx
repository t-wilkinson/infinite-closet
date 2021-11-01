import React from 'react'
import dynamic from 'next/dynamic'

import Form from '@/Form'
import { accountActions } from '@/Account/slice'
import { useDispatch } from '@/utils/store'
import { Icon } from '@/components'
import { iconClose } from '@/components/Icons'

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
      onClick={() => dispatch(accountActions.hidePopup())}
    >
      <Form onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-0 right-0 m-4 z-20"
          onClick={() => dispatch(accountActions.hidePopup())}
          type="button"
        >
          <Icon icon={iconClose} size={20} />
        </button>
        <div className="h-3" />
        <PopupForm />
      </Form>
    </div>
  )
}

export default Popup
