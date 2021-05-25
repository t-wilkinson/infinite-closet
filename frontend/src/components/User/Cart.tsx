import Image from 'next/image'
import React from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { getURL } from '@/utils/api'
import { Icon } from '@/components'

const rentalLengths = {
  short: 4,
  long: 8,
}

export const Cart = ({ dispatch, cart }) => {
  return (
    <div className="w-full space-y-2">
      {cart.map((item) => (
        <CartItem key={item.id} dispatch={dispatch} {...item} />
      ))}
    </div>
  )
}

export const CartItem = ({ dispatch, product, ...order }) => {
  const date = dayjs.utc(order.date).local() // order.date is utc
  const startDate = date.format('ddd, MMM D')
  const endDate = date
    .add(rentalLengths[order.rentalLength], 'day')
    .format('ddd, MMM D')
  const Bold = (props: object) => <span className="font-bold" {...props} />

  const removeItem = () => {
    axios
      .delete(`/orders/cart/${order.id}`, { withCredentials: true })
      .then(() => dispatch({ type: 'remove-cart-item', payload: order.id }))
      .catch((err) => console.error(err))
  }

  return (
    <div
      className={`flex-row items-center border p-4 rounded-sm relative bg-white
        ${order.available <= 0 ? 'border-warning' : 'border-gray'}
        `}
    >
      <button
        onClick={removeItem}
        className="absolute top-0 right-0 m-2 cursor-pointer"
      >
        <div className="p-1">
          <Icon name="close" size={16} />
        </div>
      </button>
      <div className="h-32 w-32 relative mr-4">
        <Image
          src={getURL(product.images[0].url)}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="lg:flex-row w-full items-start lg:items-center lg:justify-between">
        <div>
          <span>
            {product.name} by <Bold>{product.designer.name}</Bold>
          </span>
          {console.log(order)}
          <span className={`${order.dateValid ? '' : 'text-warning'}`}>
            {startDate} - {endDate}
          </span>
          <span>{order.size}</span>
          <span>
            <Bold>£{order.price}</Bold>
          </span>
        </div>
        <div className="items-end">
          <span>
            {order.available === undefined
              ? ``
              : order.available === 1
              ? `There is 1 item left. Order now before it's gone!`
              : order.available <= 0
              ? `There are not enough available items`
              : `There are ${order.available} items left`}
          </span>
        </div>
        <span className="text-warning">
          {!order.dateValid && 'This rental date is no longer valid.'}
        </span>
      </div>
    </div>
  )
}

export default Cart
