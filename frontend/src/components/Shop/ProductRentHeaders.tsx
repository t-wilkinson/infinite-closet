import React from 'react'

import { useDispatch } from '@/utils/store'

import { shopActions } from './slice'
import { RentType } from './types'

export const ProductRentHeaders = ({ product, state }) => {
  const dispatch = useDispatch()

  return (
    <div className="flex-row border-gray border rounded-md bg-gray-light divide-x divide-gray overflow-hidden">
      {Object.keys(productRentHeaders).map((rentType: RentType, i: number) => {
        return (
          <button
            key={rentType}
            style={{ flex: 1 }}
            onClick={() => dispatch(shopActions.changeRentType(rentType))}
          >
            <div
              className={`flex-grow p-2 h-full
                ${rentType === state.rentType ? 'bg-sec-light' : ''}
                `}
            >
              <div className="flex-grow items-center justify-between">
                {productRentHeaders[rentType]({ product })}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
export default ProductRentHeaders

const productRentHeaders = {
  OneTime: ({ product }) => (
    <>
      <span className="text-sm font-bold text-center">One-time rental</span>
      <span className="font-bold">£{product.rental_price}</span>
    </>
  ),

  Membership: () => (
    <>
      <span className="text-sm font-bold">Membership</span>
    </>
  ),

  Purchase: () => (
    <>
      <span className="text-sm font-bold">Purchase</span>
    </>
  ),
}
