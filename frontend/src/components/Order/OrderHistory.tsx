import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import { fmtPrice } from '@/utils/helpers'
import { getURL } from '@/utils/axios'
import { useDispatch, useSelector } from '@/utils/store'
import { OrderUtils } from '@/Order'
import { getRentalLength } from '@/Order/Cart/api'

export const Orders = () => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.orders.orderHistory)

  React.useEffect(() => {
    dispatch(OrderUtils.history())
  }, [])

  return (
    <div className="">
      {cart.map((item) => (
        <OrderItem key={item.order.id} item={item} />
      ))}
    </div>
  )
}

export const OrderItem = ({ item }) => {
  const { order } = item
  const date = dayjs(order.expectedStart || undefined).tz('Europe/London')
  const startDate = date.format('ddd, MMM D')
  const endDate = date
    .add(getRentalLength(order.rentalLength), 'day')
    .format('ddd, MMM D')
  const Bold = (props: object) => <span className="font-bold" {...props} />

  return (
    <div
      className={`relative flex-row items-center border p-4 rounded-sm relative bg-white my-2
        ${order.available <= 0 ? 'border-warning' : 'border-gray'}
        `}
    >
      <div className="h-32 w-32 relative mr-4">
        <Image
          src={getURL(order.product.images[0].url)}
          alt={order.product.images[0].alternativeText}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div>
        <span>
          {order.product.name} by <Bold>{order.product.designer.name}</Bold>
        </span>
        <div className="flex flex-row items-center">
          <span>
            {startDate} - {endDate}
          </span>
        </div>
        <span>{order.size}</span>
        <span>
          <Bold>{fmtPrice(item.totalPrice)}</Bold>
        </span>
        <span
          className={`${
            order.status === 'error' ? 'text-warning' : 'text-pri'
          }`}
        >
          {getStatus(order?.shipment)}
        </span>
      </div>
      {!order.review && order.status === 'completed' && (
        <Link href={`/review/${order.product.slug}`}>
          <a className="absolute right-0 m-2 p-3 bg-pri hover:bg-sec transition-all duration-300 text-white rounded-sm font-bold text-sm">
            Review product
          </a>
        </Link>
      )}
    </div>
  )
}

const getStatus = ({status, position}) => {
  if (status === 'delayed') {
    return 'Delayed'
  }
  switch (position) {
    case 'confirmed': return 'Confirmed'
    case 'shipped': return 'Shipping'
    case 'start': return 'In use'
    case 'end': return 'In use'
    case 'cleaned': return 'Completed'
    case 'completed': return 'Completed'
  }
}

export default Orders
