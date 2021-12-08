import React from 'react'

import axios from '@/utils/axios'
import { useFields, toDate, dobFields, Form, DateOfBirth, Input, OR, Submit} from '@/Form'
import { useDispatch } from '@/utils/store'
import { accountActions } from '@/Account/slice'
import { Button } from '@/components'

export const Email = () => {
  const dispatch = useDispatch()
  const fields = useFields({
    name: { constraints: 'required' },
    email: { constraints: 'required' },
  })
  const dob = useFields(dobFields)
  const joinMailingList = async () => {
    const cleaned = fields.clean()
    return axios
      .post('/account/mailing-list', {
        name: cleaned.name,
        email: cleaned.email,
        dateOfBirth: toDate({bday: dob.get('bday'), bmonth: dob.get('bmonth'), byear: dob.get('byear')}),
      }, {withCredentials: false})
      .catch(() => {
        throw 'Unable to add you to mailing list'
      })
  }

  return (
    <>
      <Form
        fields={fields}
          onSubmit={joinMailingList}
        Success={() => <Submitted dispatch={dispatch} fields={fields} /> }
      >
        <span className="text-center font-bold text-2xl mb-1">
          Get 10% Off Your First Rental
        </span>
        <span className="text-center">
          Join our mailing list for exclusive offers, first dibs on new items,
          birthday rewards and style inspiration.
        </span>
        <div className="mt-4" />
        <Input field={fields.get('name')} />
        <Input field={fields.get('email')} />
        <DateOfBirth bday={dob.get('bday')} bmonth={dob.get('bmonth')} byear={dob.get('byear')} />
        <Submit field={fields.form}>Join the Mailing List</Submit>
      </Form>
      <OR />
      <span>
        New to Infinite closet?{' '}
        <button onClick={() => dispatch(accountActions.showPopup('register'))}>
          <span className="cursor-pointer text-blue-500">Make an account</span>
        </button>
      </span>
      <span>
        Already a member?{' '}
        <button onClick={() => dispatch(accountActions.showPopup('signin'))}>
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
