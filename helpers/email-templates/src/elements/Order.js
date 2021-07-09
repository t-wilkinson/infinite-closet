import React from 'react'

import Img from '../elements/Img'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const Order = ({ size, price, product, range }) => {
  const formatDate = (date) =>
    dayjs(date).tz('Europe/London').format('dddd, MMM D')

  return (
    <div className="bg-gray-light w-full p-4">
      <div className="w-full flex-row space-x-2">
        <Img
          className="w-42"
          src={product.images[0].url}
          alt={product.images[0].alternativeText}
        />
        <div className="w-full pl-4">
          <div className="flex-row justify-between w-full items-center">
            <div className="items-start">
              <span className="text-gray">Rental Start:</span>
              <span className="text-sec font-bold">
                {formatDate(range.start)}
              </span>
            </div>
            <div className="items-end">
              <span className="text-gray">Rental End:</span>
              <span className="text-sec font-bold">
                {formatDate(range.end)}
              </span>
            </div>
          </div>
          <div className="w-full py-2 justify-between flex-row text-center">
            <span className="">
              <span className="font-bold">{size}</span> {product.name} by{' '}
              <span className="font-bold">{product.designer.name}</span>
            </span>
            <div className="font-bold">£{price}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
