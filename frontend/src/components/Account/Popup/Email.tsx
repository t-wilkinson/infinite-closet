import React from 'react'

import { FormHeader, Input, Submit, OR } from '@/Form'
import { useDispatch } from '@/utils/store'
import { accountActions } from '@/Account/slice'
import useFields from '@/Form/useFields'

export const Email = () => {
  const dispatch = useDispatch()
  const fields = useFields({
    email: {},
  })

  return (
    <>
      <FormHeader label="Join Us" />
      <span className="text-center mb-2">
        Our platform allows customers to hire independent brands while cutting
        their carbon footprint and making it affordable for the average
        consumer.
      </span>
      <Input {...fields.email} />
      <Submit
        onSubmit={(e) => {
          e.preventDefault()
          dispatch(accountActions.setEmail(fields.email.value))
          dispatch(accountActions.showPopup('register'))
        }}
      >
        Register Now
      </Submit>
      <OR />
      <span>
        Already a member?{' '}
        <button onClick={(e) => dispatch(accountActions.showPopup('signin'))}>
          <span className="cursor-pointer text-blue-500">Sign In</span>
        </button>
      </span>
    </>
  )
}
export default Email
