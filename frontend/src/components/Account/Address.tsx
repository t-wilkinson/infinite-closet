import React from 'react'
import axios from 'axios'

import { Icon } from '@/components'
import { Input, Submit } from '@/Form'
import { useFields, cleanFields } from '@/Form/useFields'

export const Addresses = ({ addresses, state, dispatch }) => {
  return (
    <div className="space-y-4">
      <span className="font-subheader text-2xl my-2">Addresses</span>
      {addresses.map((address) => (
        <Address
          key={address.id}
          state={state}
          dispatch={dispatch}
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
}) => (
  <div
    className={`border bg-gray-light p-4 flex-row cursor-pointer items-center
    ${id === state.address ? 'border-black' : ''}
    `}
    onClick={() => dispatch({ type: 'choose-address', payload: id })}
  >
    <div className="mr-4 w-4 h-4 rounded-full border border-gray items-center justify-center mr-2">
      <div
        className={`w-3 h-3 rounded-full
          ${id === state.address ? 'bg-sec-light' : ''}
          `}
      />
    </div>

    <div>
      <span>
        {firstName} {lastName}
      </span>
      <span>{address}</span>
      <span>{town}</span>
      <span>{postcode}</span>
    </div>
  </div>
)

export const UpdateAddress = ({ user, dispatch, state, address }) => {
  const fields = useFields({
    firstName: { constraints: 'required', defaultValue: address.firstName },
    lastName: { constraints: 'required', defaultValue: address.lastName },
    address: { constraints: 'required', defaultValue: address.address },
    town: { constraints: 'required', defaultValue: address.town },
    postcode: { constraints: 'required', defaultValue: address.postcode },
    mobileNumber: { constraints: 'required', defaultValue: user.phoneNumber },
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

  return (
    <EditAddress
      onSubmit={onSubmit}
      fields={fields}
      dispatch={dispatch}
      state={state}
    />
  )
}

export const AddAddress = ({ user, dispatch, state }) => {
  const fields = useFields({
    firstName: { constraints: 'required', defaultValue: user.firstName },
    lastName: { constraints: 'required', defaultValue: user.lastName },
    address: { constraints: 'required', defaultValue: '' },
    town: { constraints: 'required', defaultValue: '' },
    postcode: { constraints: 'required', defaultValue: '' },
    mobileNumber: { constraints: 'required', defaultValue: user.phoneNumber },
  })

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
        dispatch({ type: 'set-addresses', payload: res.data.addresses })
      })
      .catch((err) => console.error(err))
  }

  return (
    <EditAddress
      onSubmit={onSubmit}
      fields={fields}
      dispatch={dispatch}
      state={state}
    />
  )
}

const EditAddress = ({ onSubmit, fields, dispatch, state }) => {
  const [valid, setValid] = React.useState(true)

  if (state.popup !== 'address') {
    return <div />
  }

  const validatePostcode = () => {
    onSubmit()
    if (process.env.NODE_ENV === 'production') {
      axios
        .get(`/addresses/verify/${fields.postcode.value}`)
        .then((res) => {
          setValid(res.data.valid)
          onSubmit()
        })
        .catch((err) => setValid(false))
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-50 items-center justify-center">
      <form
        className="w-full max-w-sm w-full p-6 bg-white rounded-lg relative"
        onSubmit={(e) => {
          e.preventDefault()
          validatePostcode()
        }}
      >
        <div className="w-full items-center">
          <span className="font-subheader text-3xl m-2">Add Address</span>
        </div>
        <button
          className="absolute top-0 right-0 m-3"
          type="button"
          onClick={() => dispatch({ type: 'close-popup' })}
        >
          <Icon name="close" size={20} />
        </button>
        {!valid && (
          <span className="text-warning my-2">
            Sorry, we do not currently serve this location.
          </span>
        )}
        <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4">
          {Object.keys(fields).map((field) => (
            <Input key={field} {...fields[field]} />
          ))}
        </div>
        <div className="w-full items-center">
          <Submit disabled={!valid}>Submit</Submit>
        </div>
      </form>
    </div>
  )
}
