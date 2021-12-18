import React from 'react'

import axios from '@/utils/axios'
import { StrapiCoupon } from '@/types/models'
import { Summary } from '@/types'

import { UseField } from './fields'
import Input from './Input'

type CouponStatus = undefined | 'success' | 'failure'

export const DiscountCode = ({
  user,
  context,
  price,
  setSummary,
  discountCode,
}: {
  user?: string
  context: StrapiCoupon['context']
  price: number
  setSummary: (summary: Summary) => void
  discountCode: UseField<string>
}) => {
  const [status, setStatus] = React.useState<CouponStatus>()

  const checkPromo = async () => {
    const cleaned = discountCode.clean()
    return axios
      .post<Summary>(`/coupons/discount`, {
        user,
        discountCode: cleaned,
        context,
        price,
      })
      .then((summary) => {
        if (summary.coupon || summary.giftCard) {
          setSummary(summary)
          setStatus('success')
        } else {
          setStatus('failure')
          discountCode.setErrors('Could not find coupon code')
        }
      })
      .catch(() => {
        setStatus('failure')
        discountCode.setError('Encountered unknown error')
      })
  }

  if (status === undefined) {
    return (
      <Input
        field={discountCode}
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
        {discountCode.errors[0] === 'not-found'
          ? `Unable to find promo code matching ${discountCode.value}.`
          : discountCode.errors[0] === 'maxed-out'
          ? 'You have already used this coupon.'
          : `Unable to find promo code matching ${discountCode.value}.`}{' '}
        <button
          className="underline text-black"
          type="button"
          onClick={() => {
            discountCode.setValue('')
            setStatus(undefined)
          }}
        >
          Try Again?
        </button>
      </span>
    )
  }
}
