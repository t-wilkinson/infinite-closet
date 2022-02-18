import React from 'react'

import { productRentalPrice } from '@/Product/utils'

import { RentType } from './types'

export const OrderOptions = ({ product, fields }) => {
  return (
    <section className="flex-row border-gray border rounded-md divide-x divide-gray overflow-hidden">
      {Object.keys(orderOptions).map((rentType: RentType) => {
        return (
          <button
            key={rentType}
            style={{ flex: 1 }}
            type="button"
            onClick={() => fields.setValue('rentType', rentType)}
          >
            <div
              className={`flex-grow p-2 h-full
                ${rentType === fields.value('rentType') ? 'bg-pri-light' : ''}
                `}
            >
              <div className="flex-grow items-center justify-between">
                {orderOptions[rentType]({ product, fields })}
              </div>
            </div>
          </button>
        )
      })}
    </section>
  )
}

const orderOptions = {
  OneTime: ({ product, fields }) => (
    <>
      <span className="text-sm font-bold text-center">One-time rental</span>
      <span className="font-bold">
        £
        {productRentalPrice(product, fields.value('rentalLength')) || '-'}
      </span>
    </>
  ),

  Membership: () => (
    <span className="text-sm text-gray font-bold">Membership</span>
  ),

  Purchase: () => <span className="text-sm text-gray font-bold">Purchase</span>,
}

export default OrderOptions
