import React from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import { CartUtils } from '@/Cart/slice'
import { fmtPrice } from '@/utils/helpers'
import { getURL } from '@/utils/api'
import { useDispatch, useSelector } from '@/utils/store'
import { rentalLengths } from '@/utils/constants'
import AddReview from '@/Shop/AddReview'

export const Orders = () => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.orderHistory)

  React.useEffect(() => {
    dispatch(CartUtils.history())
  }, [])

  return (
    <div className="">
      {cart.map((item) => (
        <OrderItem key={item.order.id} item={item} />
      ))}
    </div>
  )
}

export const OrderItem = ({item}) => {
  const {order} = item
  const date = dayjs(order.startDate).tz('Europe/London') // order.startDate is utc
  const startDate = date.format('ddd, MMM D')
  const endDate = date
    .add(rentalLengths[order.rentalLength], 'day')
    .format('ddd, MMM D')
  const Bold = (props: object) => <span className="font-bold" {...props} />

  return (
    <div
      className={`flex-row items-center border p-4 rounded-sm relative bg-white my-2
        ${order.available <= 0 ? 'border-warning' : 'border-gray'}
        `}
    >
      <AddReview />
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
        <span className="text-pri">{statuses[order.status]}</span>
      </div>
      <AddReview />
    </div>
  )
}

const statuses = {
  planning: 'Recieved',
  shipping: 'In use',
  cleaning: 'Completed',
  completed: 'Completed',
}

export default Orders
