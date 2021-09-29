import React from 'react'
import { CouponCode } from '@/Form'

import { CartUtils } from '@/Cart/slice'
import { useDispatch } from '@/utils/store'
import { fmtPrice } from '@/utils/helpers'

export const Summary = ({
  userId = undefined,
  summary,
  couponCode,
  dispatch,
  coupon,
}) => {
  if (!summary) {
    return <div />
  }

  return (
    <div>
      <CouponCode
        price={summary.total}
        user={userId}
        context="checkout"
        setCoupon={(coupon) =>
          dispatch({ type: 'correct-coupon', payload: coupon })
        }
        field={couponCode}
      />
      <Price label="Subtotal" price={summary.subtotal} />
      <Price label="Insurance" price={summary.insurance} />
      <Price label="Shipping" price={summary.shipping} />
      <Price
        negative
        label="Discount"
        price={summary.discount + (coupon?.discount || 0)}
      />
      <div className="h-px bg-pri my-1" />
      <Price
        label="Total"
        price={coupon?.total || summary.total}
        className="font-bold"
      />
    </div>
  )
}

const Price = ({ negative = false, label, price, className = '' }) => (
  <div className={`flex-row justify-between ${className}`}>
    <span>{label}</span>
    <span>
      {negative && '-'} {fmtPrice(price)}
    </span>
  </div>
)

export const useFetchCart = () => {
  const rootDispatch = useDispatch()

  return () => {
    rootDispatch(CartUtils.view())
    rootDispatch(CartUtils.summary())
  }
}
