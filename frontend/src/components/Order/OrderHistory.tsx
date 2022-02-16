import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { fmtPrice } from '@/utils/helpers'
import dayjs from '@/utils/dayjs'
import { getURL } from '@/utils/axios'
import { useDispatch, useSelector } from '@/utils/store'
import { getRentalLength, OrderUtils } from '@/Order'

export const Orders = () => {
  const dispatch = useDispatch()
  const history = useSelector((state) => state.orders.checkoutHistory)

  React.useEffect(() => {
    dispatch(OrderUtils.history())
  }, [])

  return (
    <div className="space-y-6">
      {history.map((checkout) => {
        const paymentStatus = checkout.purchase?.paymentIntent?.status

        return (
          <div className="border border-gray p-2">
            <strong>{dayjs(checkout.created_at).format('ddd, MMM D')}</strong>
            {checkout.orders.map((item) => (
              <OrderItem key={item.order.id} item={item} />
            ))}
          </div>
        )
      })}
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
      className={`relative flex-row items-center rounded-sm relative bg-white my-2
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
          <a className="text-center md:absolute right-0 m-2 p-3 bg-pri hover:bg-sec transition-all duration-300 text-white rounded-sm font-bold text-sm">
            Review product
          </a>
        </Link>
      )}
    </div>
  )
}

const getStatus = (props) => {
  if (!props) {
    return ''
  }

  const { status, position } = props
  if (status === 'delayed') {
    return 'Delayed'
  }
  switch (position) {
    case 'confirmed':
      return 'Confirmed'
    case 'shipped':
      return 'Shipping'
    case 'start':
      return 'In use'
    case 'end':
      return 'In use'
    case 'cleaned':
      return 'Completed'
    case 'completed':
      return 'Completed'
  }
}

export default Orders
