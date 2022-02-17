import React from 'react'
import Image from 'next/image'

import { fmtPrice } from '@/utils/helpers'
import dayjs from '@/utils/dayjs'
import { getURL } from '@/utils/axios'
import { useDispatch, useSelector } from '@/utils/store'
import { getRentalLength, OrderUtils } from '@/Order'
import { ButtonLink } from '@/Components'

export const Orders = () => {
  const dispatch = useDispatch()
  const history = useSelector((state) => state.orders.checkoutHistory)

  React.useEffect(() => {
    dispatch(OrderUtils.history())
  }, [])

  return (
    <div className="space-y-8 max-w-screen-md">
      {history.map((checkout) => {
        const paymentIntent = checkout.purchase?.paymentIntent
        const paymentStatus = paymentIntent?.status
        const paymentError =
          (paymentStatus && paymentStatus !== 'succeeded') ||
          process.env.NODE_ENV === 'development'

        return (
          <div key={checkout.id} className="border-gray p-2">
            <div className="space-x-2 flex-row justify-between">
              <strong className="mb-4">
                {dayjs(checkout.created_at).format('ddd, MMM D')}
              </strong>
              {(paymentError || process.env.NODE_ENV === 'development') &&
                paymentIntent && (
                  <ButtonLink
                    href={`/buy/complete?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}`}
                    role="error"
                  >
                    Please complete your payment
                  </ButtonLink>
                )}
            </div>
            {checkout.orders.map((item) => (
              <OrderItem
                key={item.order.id}
                item={item}
                paymentError={paymentError}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

export const OrderItem = ({ item, paymentError }) => {
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
      <div className="h-32 w-24 relative mr-4">
        <Image
          src={getURL(order.product.images[0].url)}
          alt={order.product.images[0].alternativeText}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="flex-row justify-between items-center w-full flex-wrap">
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
              order.status === 'error' || paymentError
                ? 'text-warning'
                : 'text-pri'
            }`}
          >
            {getStatus({ ...order?.shipment, paymentError })}
          </span>
        </div>
        {!order.review && order.status === 'completed' && (
          <ButtonLink
            href={`/review/${order.product.slug}`}
            className="text-center"
          >
            Review product
          </ButtonLink>
        )}
      </div>
    </div>
  )
}

const getStatus = ({ paymentError, ...shipment }) => {
  if (!shipment.status || !shipment.shippingStatus) {
    return ''
  }

  if (shipment.shippingStatus === 'delayed') {
    return 'Delayed'
  }
  if (paymentError) {
    return 'Payment error'
  }

  switch (shipment.status) {
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
