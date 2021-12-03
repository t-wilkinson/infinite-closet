import React from 'react'
import axios from 'axios'

import { StrapiCoupon } from '@/utils/models'

import {UseField} from './fields'
import { Coupon } from './types'
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
  field: UseField
}) => {
  const [status, setStatus] = React.useState<CouponStatus>()
  const [message, setMessage] = React.useState<string>()

  const checkPromo = async () => {
    const code = field.clean()
    return axios
      .post(`/coupons/discount`, {
        user,
        code,
        context,
        price,
      })
      .then((res) => res.data)
      .then((coupon) => {
        if (coupon.valid) {
          setCoupon(coupon)
          setStatus('success')
        } else {
          setStatus('failure')
          setMessage('Could not find coupon code')
        }
      })
      .catch((err) => {
        if (err.valid === false) {
          setStatus('failure')
          setMessage(err.reason)
        }
      })
  }

  if (status === undefined) {
    return (
      <Input
        field={field}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
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
        {message === 'not-found'
          ? `Unable to find promo code matching ${field.value}.`
          : message === 'maxed-out'
          ? 'You have already used this coupon.'
          : `Unable to find promo code matching ${field.value}.`}{' '}
        <button
          className="underline text-black"
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

