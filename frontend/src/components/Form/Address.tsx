import React from 'react'

import axios from '@/utils/axios'
import { useFields, Form, Input, Submit, UseFields } from '@/Form'
import useSignin from '@/User/useSignin'
import { Icon, iconClose } from '@/Components/Icons'
import { StrapiAddress } from '@/types/models'
import useAnalytics from '@/utils/useAnalytics'

const toFullName = ({firstName, lastName}) => [firstName, lastName].join(' ').trim()

export interface AddressFields {
  fullName: string
  mobileNumber: string
  addressLine1: string
  addressLine2: string
  town: string
  postcode: string
}

export const useAddressFields = (
  address: Partial<StrapiAddress> = {}
): UseFields<AddressFields> => {
  const def = (field: string) =>
    typeof address[field] === 'string' ? address[field] : ''
  const fields = useFields<AddressFields>({
    fullName: { constraints: 'required', default: def('fullName') },
    mobileNumber: { constraints: 'required', default: def('phoneNumber') },
    addressLine1: {
      constraints: 'required',
      label: 'Street Address',
      default: def('addressLine1'),
    },
    addressLine2: {
      constraints: '',
      label: 'Apt, Suit, etc.',
      default: def('addressLine2'),
    },
    town: { constraints: 'required', default: def('town') },
    postcode: { constraints: 'required', default: def('postcode') },
  })
  return fields
}

// Fails if postcode is invalid for promise chaining
export const validatePostcode = async (value: string) => {
  return axios
    .get<{ valid: boolean }>(`/addresses/verify/${value.replace(/\s+/g, '')}`, {
      withCredentials: false,
    })
    .then((data) => {
      if (data.valid) {
        return
      } else {
        throw new Error('Sorry, we do not currently serve this location.')
      }
    })
    .catch((err) => {
      console.error(err)
      throw new Error('Sorry, we do not currently serve this location.')
    })
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
  fullName = '',
  addressLine1,
  addressLine2 = '',
  town,
  postcode,
}) => {
  const signin = useSignin()

  const removeAddress = () => {
    axios
      .delete<void>(`/account/${userId}/addresses/${id}`)
      .then(() => signin())
      .catch((err) => console.error(err))
  }

  return (
    <div className="relative">
      <button
        className={`relative flex border p-4 flex-row cursor-pointer items-center
          ${id === selected ? 'border-black' : ''}
        `}
        aria-label={`Choose address with name of ${fullName} in ${addressLine1} ${town} ${postcode}`}
        onClick={() => select(id)}
      >
        <div className="mr-4 w-4 h-4 rounded-full border border-gray items-center justify-center mr-2">
          <div
            className={`w-3 h-3 rounded-full
              ${id === selected ? 'bg-sec' : ''}
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
        <Icon icon={iconClose} size={16} />
      </button>
    </div>
  )
}

export const UpdateAddress = ({ dispatch, address }) => {
  const fields = useAddressFields(address)
  const onSubmit = async () => {
    const cleaned = fields.clean()
    return axios
      .put<{ addresses: StrapiAddress[] }>(`/addresses/${address.id}`, cleaned)
      .then((data) =>
        dispatch({ type: 'set-addresses', payload: data.addresses })
      )
      .catch(() => {
        throw 'Unable to change address'
      })
  }

  return <EditAddress onSubmit={onSubmit} fields={fields} />
}

export const AddAddress = ({ user, onSubmit }) => {
  const fields = useAddressFields({
    fullName: toFullName(user),
    mobileNumber: user.phoneNumber,
  })
  const signin = useSignin()
  const analytics = useAnalytics()

  const createAddress = async () => {
    const cleaned = fields.clean()
    return axios
      .post<void>(`/account/${user.id}/addresses`, cleaned)
      .then(() => {
        analytics.logEvent('add_shipping_info', {
          user: user.email,
        })
        onSubmit()
        signin()
      })
      .catch(() => {
        throw new Error('Unable to add address')
      })
  }

  return <EditAddress onSubmit={createAddress} fields={fields} />
}

export const EditAddress = ({
  onSubmit,
  fields,
}: {
  onSubmit: () => void
  fields: UseFields<AddressFields>
}) => {
  const onSubmitInternal = async () => {
    return validatePostcode(fields.value('postcode')).then(() => {
      return onSubmit()
    })
  }

  return (
    <Form fields={fields} onSubmit={onSubmitInternal} className="max-w-lg">
      <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4 gap-y-4">
        {fields.map((field) => (
          <Input key={field.name} field={field} />
        ))}
      </div>
      <Submit form={fields.form} className="w-full" />
    </Form>
  )
}
