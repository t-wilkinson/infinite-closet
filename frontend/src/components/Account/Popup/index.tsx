import React from 'react'
import dynamic from 'next/dynamic'

import Form from '@/Form'
import { accountActions } from '@/Account/slice'
import { useDispatch } from '@/utils/store'
import { Icon } from '@/components'

const PopupRegister = dynamic(() => import('./Register'))
const PopupSignIn = dynamic(() => import('./SignIn'))
// const EmailSignIn = dynamic(() => import('./Email'))

const popups = {
  hidden: () => null,
  // email: () => null,
  register: PopupRegister,
  'sign-in': PopupSignIn,
}

export const Popup = ({ popup }) => {
  const dispatch = useDispatch()
  const PopupForm = popups[popup]

  return (
    <div
      className={`
      fixed inset-0 z-40 bg-black bg-opacity-70 h-full pt-20
      ${popup === 'hidden' ? 'hidden' : ''}
    `}
    >
      <Form>
        <button
          className="absolute top-0 right-0 m-4"
          onClick={() => dispatch(accountActions.hidePopup())}
        >
          <Icon name="close" size={20} />
        </button>
        <PopupForm />
      </Form>
    </div>
  )
}

export default Popup
