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

export const Orders = () => {
  const user = useSelector((state) => state.user.data)
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.cart.ordersStatus)

  React.useEffect(() => {
    dispatch(CartUtils.status())
  }, [])

  return (
    <div className="">
      {orders.map((order) => (
        <OrderItem key={order.id} dispatch={dispatch} {...order} />
      ))}
    </div>
  )
}

export const OrderItem = ({ dispatch, product, ...order }) => {
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
      <div className="h-32 w-32 relative mr-4">
        <Image
          src={getURL(product.images[0].url)}
          alt={product.images[0].alternativeText}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div>
        <span>
          {product.name} by <Bold>{product.designer.name}</Bold>
        </span>
        <div className="flex flex-row items-center">
          <span>
            {startDate} - {endDate}
          </span>
        </div>
        <span>{order.size}</span>
        <span>
          <Bold>{fmtPrice(order.price)}</Bold>
        </span>
        <span className="text-pri">{statuses[order.status]}</span>
      </div>
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
