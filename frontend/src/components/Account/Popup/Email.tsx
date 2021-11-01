import React from 'react'
import axios from 'axios'

import { DateOfBirth, Input, OR } from '@/Form'
import useFields, {
  useDateOfBirth,
  toDate,
  cleanFields,
} from '@/Form/useFields'
import { useDispatch } from '@/utils/store'
import { accountActions } from '@/Account/slice'
import { Button } from '@/components'

export const Email = () => {
  const dispatch = useDispatch()
  const fields = useFields({
    name: { constraints: 'required' },
    email: { constraints: 'required' },
  })
  const dateOfBirth = useDateOfBirth()
  const [status, setStatus] = React.useState(null)
  const joinMailingList = () => {
    const cleaned = cleanFields(fields)
    axios
      .post('/account/mailing-list', {
        name: cleaned.name,
        email: cleaned.email,
        dateOfBirth: toDate(dateOfBirth).toJSON(),
      })
      .catch((err) => console.error(err))
  }

  return (
    <>
      <div className="relative">
        <span className="text-center font-bold text-2xl mb-1">
          Get 10% Off Your First Rental
        </span>
        <span className="text-center">
          Join our mailing list for exclusive offers, first dibs on new items,
          birthday rewards and style inspiration.
        </span>
        <div className="mt-4" />
        <Input {...fields.name} />
        <Input {...fields.email} />
        <DateOfBirth {...dateOfBirth} />
        <Button
          disabled={status === 'submitted'}
          className="mt-2"
          onClick={(e) => {
            e.preventDefault()
            setStatus('submitted')
            joinMailingList()
          }}
        >
          Join the Mailing List
        </Button>
        {status === 'submitted' && (
          <Submitted dispatch={dispatch} fields={fields} />
        )}
      </div>
      <OR />
      <span>
        New to Infinite closet?{' '}
        <button onClick={(e) => dispatch(accountActions.showPopup('register'))}>
          <span className="cursor-pointer text-blue-500">Make an account</span>
        </button>
      </span>
      <span>
        Already a member?{' '}
        <button onClick={(e) => dispatch(accountActions.showPopup('signin'))}>
          <span className="cursor-pointer text-blue-500">Sign In</span>
        </button>
      </span>
    </>
  )
}

const Submitted = ({ dispatch, fields }) => (
  <div className="z-20 absolute inset-0 bg-white items-center justify-center">
    <strong className="text-2xl">Thanks for signing up!</strong>
    <span className="text-center">
      Would you also like to create an account?
    </span>
    <span className="text-center mb-8">It's easy!</span>
    <div className="flex-row w-full space-x-4">
      <Button
        className="w-full"
        onClick={() => {
          dispatch(accountActions.setEmail(fields.email.value))
          dispatch(accountActions.setName(fields.name.value))
          dispatch(accountActions.showPopup('register'))
        }}
      >
        Sure thing
      </Button>
      <Button
        className="w-full"
        role="secondary"
        onClick={() => dispatch(accountActions.hidePopup())}
      >
        Not today
      </Button>
    </div>
  </div>
)

export default Email
