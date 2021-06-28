import React from 'react'
import axios from 'axios'

import { Icon } from '@/components'
import { Input, Submit } from '@/Form'
import { useFields, cleanFields } from '@/Form/useFields'
import { useDispatch } from '@/utils/store'
import { signin } from './'

export const Addresses = ({ userId, addresses, state, dispatch }) => {
  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <Address
          key={address.id}
          state={state}
          dispatch={dispatch}
          userId={userId}
          {...address}
        />
      ))}
    </div>
  )
}

const Address = ({
  id,
  dispatch,
  state,
  address,
  town,
  postcode,
  firstName,
  lastName,
  userId,
}) => {
  const rootDispatch = useDispatch()

  const removeAddress = () => {
    axios
      .delete(`/account/${userId}/addresses/${id}`, { withCredentials: true })
      .then(() => signin(rootDispatch))
      .catch((err) => console.error(err))
  }

  return (
    <button
      className={`relative flex border bg-gray-light p-4 flex-row cursor-pointer items-center
    ${id === state.address ? 'border-black' : ''}
    `}
      aria-label={`Choose address with name of {firstName} {lastName} in {address} {town} {postcode}`}
      onClick={() => dispatch({ type: 'choose-address', payload: id })}
    >
      <button
        className="absolute top-0 right-0 p-2"
        type="button"
        onClick={removeAddress}
      >
        <Icon name="close" size={16} />
      </button>

      <div className="mr-4 w-4 h-4 rounded-full border border-gray items-center justify-center mr-2">
        <div
          className={`w-3 h-3 rounded-full
          ${id === state.address ? 'bg-pri' : ''}
  `}
        />
      </div>

      <div className="items-start">
        <span>
          {firstName} {lastName}
        </span>
        <span>{address}</span>
        <span>{town}</span>
        <span>{postcode}</span>
      </div>
    </button>
  )
}

export const UpdateAddress = ({ user, dispatch, address }) => {
  const fields = useFields({
    firstName: { constraints: 'required', default: address.firstName },
    lastName: { constraints: 'required', default: address.lastName },
    address: { constraints: 'required', default: address.address },
    town: { constraints: 'required', default: address.town },
    postcode: { constraints: 'required', default: address.postcode },
    mobileNumber: { constraints: 'required', default: user.phoneNumber },
  })

  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
      .put(
        `/addresses/${address.id}`,
        {
          ...cleaned,
        },
        { withCredentials: true },
      )
      .then((res) =>
        dispatch({ type: 'set-addresses', payload: res.data.addresses }),
      )
      .catch((err) => console.error(err))
  }

  return <EditAddress onSubmit={onSubmit} fields={fields} />
}

export const AddAddress = ({ user, dispatch }) => {
  const fields = useFields({
    firstName: { constraints: 'required', default: user.firstName },
    lastName: { constraints: 'required', default: user.lastName },
    address: { constraints: 'required', default: '' },
    town: { constraints: 'required', default: '' },
    postcode: { constraints: 'required', default: '' },
    mobileNumber: { constraints: 'required', default: user.phoneNumber },
  })
  const rootDispatch = useDispatch()

  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
      .post(
        `/account/${user.id}/addresses`,
        {
          ...cleaned,
        },
        { withCredentials: true },
      )
      .then((res) => {
        dispatch({ type: 'close-popup' })
        signin(rootDispatch)
      })
      .catch((err) => console.error(err))
  }

  return <EditAddress onSubmit={onSubmit} fields={fields} />
}

const EditAddress = ({ onSubmit, fields }) => {
  const [valid, setValid] = React.useState(true)

  const validatePostcode = () => {
    if (process.env.NODE_ENV === 'production') {
      axios
        .get(`/addresses/verify/${fields.postcode.value}`)
        .then((res) => {
          setValid(res.data.valid)
          if (res.data.valid) {
            onSubmit()
          }
        })
        .catch((err) => setValid(false))
    } else {
      onSubmit()
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        validatePostcode()
      }}
    >
      <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4">
        {Object.keys(fields).map((field) => (
          <Input key={field} {...fields[field]} />
        ))}
      </div>
      {!valid && (
        <span className="text-warning mb-2 inline-block">
          Sorry, we do not currently serve this location.
        </span>
      )}
      <div className="w-full items-center">
        <Submit disabled={!valid} className="w-full">
          Submit
        </Submit>
      </div>
    </form>
  )
}
