import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import { fmtPrice } from '@/utils/money'
import { getURL } from '@/utils/api'
import { Checkbox } from '@/Form/'
import { Icon, Hover } from '@/components'
import { rentalLengths } from '@/utils/constants'
import { normalizeSize } from '@/Products/helpers'

export const Cart = ({ dispatch, cart, insurance }) => {
  return (
    <div className="w-full space-y-2">
      {cart.map((item) => {
        return (
          <CartItem
            key={item.id}
            dispatch={dispatch}
            insurance_={insurance[item.id]}
            {...item}
          />
        )
      })}
    </div>
  )
}

export const CartItem = ({ dispatch, product, insurance_, ...order }) => {
  const date = dayjs(order.startDate).tz('Europe/London') // order.startDate is utc
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
        ${
          order.available <= 0 || !order.dateValid
            ? 'border-warning'
            : 'border-gray'
        }
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
          alt={product.images[0].alternativeText}
          layout="fill"
          objectFit="contain"
        />
      </div>

      <div className="lg:flex-row w-full items-start lg:items-center lg:justify-between">
        <div>
          <span>
            {product.name} by &nbsp;
            <Link href={`/designers/${product.designer.slug}`}>
              <a target="_blank">
                <span className="pt-4 font-bold hover:underline">
                  {product.designer.name}
                </span>
              </a>
            </Link>
          </span>
          <div className="flex flex-row items-center">
            <span className={` ${order.dateValid ? '' : 'text-warning'} `}>
              {startDate} - {endDate}
            </span>
            {!order.dateValid && (
              <Hover>This rental date is no longer valid.</Hover>
            )}
          </div>
          <span>{normalizeSize(order.size)}</span>
          <span>
            <Bold>{fmtPrice(order.price)}</Bold>
          </span>
        </div>
        <div className="items-start lg:items-end">
          <span>
            {order.available === undefined
              ? ``
              : order.available === 1
              ? `There is 1 item left.`
              : // ? `There is 1 item left. Order now before it's gone!`
              order.available <= 0
              ? `There are not enough available items`
              : `There are ${order.available} items left`}
          </span>

          <div className="relative flex-row items-center">
            <Checkbox
              onChange={() =>
                dispatch({ type: 'toggle-insurance', payload: order.id })
              }
              value={insurance_}
              label="Include insurance"
            />
            <Hover position="right-0">
              We offer damage protection with every item, which renters can opt
              in to purchase for £5 per order. Damage protection covers the cost
              of the repair (I.e.—stain removal, broken zippers, missing
              beading), up to a max of £50. This does not cover: Damage beyond
              repair Theft or loss of item Damages beyond the £50 repair fee
            </Hover>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
