import React from 'react'
import { useRouter } from 'next/router'

import { FormHeader, Input, Submit, OR } from '@/Form'
import { useDispatch } from '@/utils/store'
import { accountActions } from '@/Account/slice'
import useFields from '@/Form/useFields'

export const Email = () => {
  const dispatch = useDispatch()
  const fields = useFields({
    email: {},
  })
  const router = useRouter()

  return (
    <>
      <FormHeader label="Join Us" />
      <span className="text-center mb-2">
        Our platform allows customers to hire independent brands while cutting
        their carbon footprint and making it affordable for the average
        consumer.
      </span>
      {/* <button */}
      {/*   className="bg-sec hover:bg-pri p-3 text-white font-bold mb-2 mt-4 transition-all duration-200" */}
      {/*   type="button" */}
      {/*   onClick={() => { */}
      {/*     dispatch(accountActions.hidePopup()) */}
      {/*     router.push('/launch-party') */}
      {/*   }} */}
      {/* > */}
      {/*   Join the Launch Party */}
      {/* </button> */}
      {/* <OR /> */}
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
