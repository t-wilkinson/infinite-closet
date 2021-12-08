import React from 'react'

import axios from '@/utils/axios'
import { StrapiCoupon } from '@/types/models'

import { Coupon } from './types'
import { UseField } from './fields'
import Input from './Input'

type CouponStatus = undefined | 'success' | 'failure'

export const CouponCode = ({
  user,
  context,
  price,
  setCoupon,
  field,
}: {
  user?: string
  context: StrapiCoupon['context']
  price: number
  setCoupon: (coupon: Coupon) => void
  field: UseField<string>
}) => {
  const [status, setStatus] = React.useState<CouponStatus>()

  const checkPromo = async () => {
    const code = field.clean()
    return axios
      .post<Coupon>(`/coupons/discount`, {
        user,
        code,
        context,
        price,
      })
      .then((coupon) => {
        if (coupon.valid) {
          setCoupon(coupon)
          setStatus('success')
        } else {
          setStatus('failure')
          field.setErrors('Could not find coupon code')
        }
      })
      .catch((err) => {
        if (err.valid === false) {
          setStatus('failure')
          field.setErrors(err.reason)
        }
      })
  }

  if (status === undefined) {
    return (
      <Input
        field={field}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            checkPromo()
          }
        }}
        after={
          <button
            className="flex px-4 py-3 border-l border-gray"
            onClick={checkPromo}
            type="button"
          >
            Apply
          </button>
        }
      />
    )
  } else if (status === 'success') {
    return (
      <span className="w-full p-2 mb-2 text-sec bg-gray-light">
        Successfully applied promo code!
      </span>
    )
  } else {
    return (
      <span className="text-warning w-full p-2 mb-2 bg-gray-light">
        {field.errors[0] === 'not-found'
          ? `Unable to find promo code matching ${field.value}.`
          : field.errors[0] === 'maxed-out'
          ? 'You have already used this coupon.'
          : `Unable to find promo code matching ${field.value}.`}{' '}
        <button
          className="underline text-black"
          type="button"
          onClick={() => {
            field.setValue('')
            setStatus(undefined)
          }}
        >
          Try Again?
        </button>
      </span>
    )
  }
}
