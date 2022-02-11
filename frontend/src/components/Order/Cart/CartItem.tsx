import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

import { getURL } from '@/utils/axios'
import dayjs from '@/utils/dayjs'
import { fmtPrice } from '@/utils/helpers'
import * as sizing from '@/utils/sizing'
import { useDispatch} from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

import { InsuranceInfo } from '@/Order/Checkout/Utils'
import { Checkbox} from '@/Form'

import { EditCartItem } from './EditCartItem'
import * as types from './types'
import { getRentalLength, toggleInsurance, removeOrderItem, moveToFavorites } from '@/Order'

export const CartItem = ({
  valid,
  totalPrice,
  available,
  order,
}: types.CartItem) => {
  const [editOrder, setEditOrder] = React.useState(false)
  const analytics = useAnalytics()
  const dispatch = useDispatch()

  const { product } = order

  return (
    <>
      <EditCartItem
        order={order}
        isOpen={editOrder}
        close={() => setEditOrder(false)}
      />
      <div
        className={`w-full mb-4 sm:my-0 sm:p-4 rounded-sm relative bg-white
        ${!valid ? 'border border-warning' : ''}
        `}
        style={{
          display: 'grid',
          gridTemplate: `
          "img info" auto
          "img ." auto
          / 8rem auto
          `,
        }}
      >
        <div className="mr-4" style={{ gridArea: 'img' }}>
          <Link href={`/shop/${product.designer.slug}/${product.slug}`}>
            <a className="h-full w-full relative">
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

        <div
          style={{
            gridArea: 'info',
          }}
          className="items-start
          md:items-stretch
          lg:flex-row w-full lg:items-center lg:justify-between
          "
        >
          <OrderInformation order={order} valid={valid} available={available} />
          <OrderPrice
            totalPrice={totalPrice}
            toggleInsurance={() => toggleInsurance({order, dispatch})}
            order={order}
          />
        </div>

        <div className="flex-row space-x-4 row-start-3 col-start-1 col-span-2 sm:row-start-2 sm:col-start-2 sm:col-span-1 mt-2">
          <button onClick={() => moveToFavorites({order, dispatch})} type="button">
            <span className="underline">move to favourites</span>
          </button>
          <button onClick={() => setEditOrder(true)} type="button">
            <span className="underline">edit</span>
          </button>
          <button
            onClick={() => removeOrderItem({ dispatch, order, analytics })}
            type="button"
            aria-label="Remove checkout item"
          >
            <span className="underline">remove</span>
          </button>
        </div>
      </div>
    </>
  )
}

const OrderPrice = ({ totalPrice, toggleInsurance, order }) => (
  <div className="w-full md:w-auto items-end lg:items-end">
    <div className="items-end space-y-2">
      <span>
        <strong>{fmtPrice(totalPrice)}</strong>
      </span>
      <div className="relative flex-row items-center">
        <Checkbox
          onChange={toggleInsurance}
          value={order.insurance || false}
          label="Include insurance"
        />
        <InsuranceInfo position="right-0" />
      </div>
    </div>
  </div>
)

const OrderInformation = ({ order, available, valid }) => {
  const { product } = order
  const date = dayjs(order.expectedStart || undefined).tz('Europe/London')
  const startDate = date.format('ddd, MMM D')
  const endDate = date
    .add(getRentalLength(order.rentalLength), 'day')
    .format('ddd, MMM D')

  return (
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
        {!valid && (
          <strong>&nbsp;&nbsp;This rental date is no longer valid</strong>
        )}
      </div>
      <div className="flex-row">
        <span>{sizing.normalize(order.size)}</span>
        &nbsp; &nbsp;
        <span className="text-gray">
          {available === undefined
            ? ``
            : valid && available === 1
            ? `Only 1 left!`
            : available > 1
            ? `There are ${available} items left`
            : ``}
        </span>
      </div>
    </div>
  )
}

