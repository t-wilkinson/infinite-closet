import React from 'react'
import axios from 'axios'

import { StrapiAddress } from '@/utils/models'
import { Button, Icon } from '@/components'
import { Input } from '@/Form'
import { useFields, cleanFields } from '@/Form/useFields'
import useAnalytics from '@/utils/useAnalytics'

import { useSignin } from './'

export const useAddressFields = (address: Partial<StrapiAddress> = {}) => {
  const str = (field: string) =>
    typeof address[field] === 'string' ? address[field] : ''
  const fields = useFields({
    fullName: { constraints: 'required', default: str('fullName') },
    mobileNumber: { constraints: 'required', default: str('phoneNumber') },
    addressLine1: {
      constraints: 'required',
      label: 'Street Address',
      default: str('addressLine1'),
    },
    addressLine2: {
      constraints: '',
      label: 'Apt, Suit, etc.',
      default: str('addressLine2'),
    },
    town: { constraints: 'required', default: str('town') },
    postcode: { constraints: 'required', default: str('postcode') },
  })
  return fields
}

export const Addresses = ({ userId, addresses, state, select }) => {
  return (
    <div className="space-y-4">
      {addresses.map((address: StrapiAddress) => (
        <Address
          key={address.id}
          selected={state.address}
          select={select}
          userId={userId}
          {...address}
        />
      ))}
    </div>
  )
}

export const Address = ({
  id,
  select,
  selected,
  userId,
  fullName,
  addressLine1,
  addressLine2,
  town,
  postcode,
}) => {
  const signin = useSignin()

  const removeAddress = () => {
    axios
      .delete(`/account/${userId}/addresses/${id}`, { withCredentials: true })
      .then(() => signin())
      .catch((err) => console.error(err))
  }

  return (
    <div className="relative">
      <button
        className={`relative flex border bg-gray-light p-4 flex-row cursor-pointer items-center
    ${id === selected ? 'border-black' : ''}
    `}
        aria-label={`Choose address with name of ${fullName} in ${addressLine1} ${town} ${postcode}`}
        onClick={() => select(id)}
      >
        <div className="mr-4 w-4 h-4 rounded-full border border-gray items-center justify-center mr-2">
          <div
            className={`w-3 h-3 rounded-full
          ${id === selected ? 'bg-pri' : ''}
  `}
          />
        </div>

        <div className="items-start">
          <span>{fullName}</span>
          <span>{addressLine1}</span>
          <span>{addressLine2}</span>
          <span>{town}</span>
          <span>{postcode}</span>
        </div>
      </button>

      <button
        className="absolute top-0 right-0 p-2"
        aria-label="Remove address"
        type="button"
        onClick={removeAddress}
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  )
}

export const UpdateAddress = ({ dispatch, address }) => {
  const fields = useAddressFields(address)
  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
      .put(
        `/addresses/${address.id}`,
        {
          ...cleaned,
        },
        { withCredentials: true }
      )
      .then((res) =>
        dispatch({ type: 'set-addresses', payload: res.data.addresses })
      )
      .catch((err) => console.error(err))
  }

  return <EditAddress onSubmit={onSubmit} fields={fields} />
}

export const AddAddress = ({ user, onSubmit }) => {
  const fields = useAddressFields({
    fullName: `${user.firstName} ${user.lastName}`,
    mobileNumber: user.phoneNumber,
  })
  const signin = useSignin()
  const analytics = useAnalytics()

  const createAddress = () => {
    const cleaned = cleanFields(fields)
    axios
      .post(
        `/account/${user.id}/addresses`,
        {
          ...cleaned,
        },
        { withCredentials: true }
      )
      .then(() => {
        analytics.logEvent('add_shipping_info', {
          user: user.email,
        })
        onSubmit()
        signin()
      })
      .catch((err) => console.error(err))
  }

  return <EditAddress onSubmit={createAddress} fields={fields} />
}

export const validatePostcode = async (value) => {
  if (
    process.env.NODE_ENV === 'test' ||
    process.env.NODE_ENV === 'production'
  ) {
    return axios
      .get(`/addresses/verify/${value}`)
      .then((res) => {
        if (res.data.valid) {
          return
        } else {
          throw new Error('Postcode not served')
        }
      })
      .catch((err) => {
        throw err
      })
  } else {
    return
  }
}

export const EditAddress = ({ onSubmit, fields }) => {
  const [valid, setValid] = React.useState(true)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        validatePostcode(fields.postcode.value)
          .then(() => {
            setValid(true)
            onSubmit()
          })
          .catch((err) => {
            setValid(false)
            console.error(err)
          })
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
        <Button disabled={!valid} className="w-full">
          Submit
        </Button>
      </div>
    </form>
  )
}
