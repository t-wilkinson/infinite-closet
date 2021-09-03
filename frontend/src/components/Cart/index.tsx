import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import useAnalytics from '@/utils/useAnalytics'
import { fmtPrice } from '@/utils/helpers'
import { getURL } from '@/utils/api'
import { Checkbox } from '@/Form/'
import { Icon, Hover } from '@/components'
import { rentalLengths } from '@/utils/constants'
import * as sizing from '@/utils/sizing'
import { useSelector } from '@/utils/store'

import { PreviewCart, CheckoutItem } from './types'

// export type CartItem = PreviewCartItem & {
//   toggleInsurance: (id: string) => void
//   remove: (order: any) => void
// }

export const Cart = ({}: PreviewCart) => {
  const cart = useSelector((state) => state.cart.checkoutCart)
  return (
    <div className="w-full space-y-2">
      {cart.map((item) => {
        return <CartItem key={item.id} {...item} />
      })}
    </div>
  )
}

export const CartItem = ({
  valid,
  price,
  available,
  ...order
}: CheckoutItem) => {
  const { product } = order
  const date = dayjs(order.startDate).tz('Europe/London') // order.startDate is utc
  const startDate = date.format('ddd, MMM D')
  const endDate = date
    .add(rentalLengths[order.rentalLength], 'day')
    .format('ddd, MMM D')
  const Bold = (props: object) => <span className="font-bold" {...props} />
  const analytics = useAnalytics()

  // TODO!
  function toggleInsurance() {}

  const removeItem = () => {
    analytics.logEvent('remove_from_cart', {
      user: order.user?.email || '',
    })
  }
  return (
    <div
      className={`flex-row items-center border p-4 rounded-sm relative bg-white
        ${!valid ? 'border-warning' : 'border-gray'}
        `}
    >
      <button
        onClick={removeItem}
        aria-label="Remove checkout item"
        className="absolute top-0 right-0 m-2 cursor-pointer"
      >
        <div className="p-1">
          <Icon name="close" size={16} />
        </div>
      </button>
      <div className="h-32 w-32 relative mr-4">
        <Link href={`/shop/${product.designer.slug}/${product.slug}`}>
          <a>
            <Image
              src={getURL(
                product.images[0].formats.thumbnail?.url ||
                  product.images[0].url
              )}
              alt={product.images[0].alternativeText}
              layout="fill"
              objectFit="contain"
            />
          </a>
        </Link>
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
            <span className={`${valid ? '' : 'text-warning'}`}>
              {startDate} - {endDate}
            </span>
            {!valid && <Hover>This rental date is no longer valid.</Hover>}
          </div>
          <span>{sizing.normalize(order.size)}</span>
          <span>
            <Bold>{fmtPrice(price)}</Bold>
          </span>
        </div>
        <div className="items-start lg:items-end">
          <span>
            {available === undefined
              ? ``
              : valid && available === 1
              ? `There is 1 item left.`
              : !valid
              ? `Please select a different date`
              : available > 1
              ? `There are ${available} items left`
              : ``}
          </span>

          <div className="relative flex-row items-center">
            <Checkbox
              onChange={() => toggleInsurance(order.id)}
              value={order.insurance}
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
