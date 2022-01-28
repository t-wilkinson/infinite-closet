import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import { getURL } from '@/utils/axios'
import useAnalytics from '@/utils/useAnalytics'
import { fmtPrice } from '@/utils/helpers'
import { Checkbox, useFields, Form, Submit } from '@/Form'
import { rentalLengths } from '@/utils/config'
import * as sizing from '@/utils/sizing'
import { useDispatch, useSelector } from '@/utils/store'
import CartUtils from '@/Cart/utils'
import DatePicker from '@/Shop/DatePicker'
import { Popup } from '@/Layout'
import { SelectRentalDate, SelectRentalSize } from '@/Shop/AddToCart'
import { AddToCartFields } from '@/Shop/types'
import { productImageProps } from '@/Products/utils'
import { InsuranceInfo } from '@/Checkout/Utils'

import * as types from './types'

export const Cart = () => {
  const cart = useSelector((state) => state.cart.checkoutCart)

  return (
    <div className="w-full space-y-2">
      {cart.map((item) => {
        return <CartItem key={item.order.id} {...item} />
      })}
    </div>
  )
}

export const removeOrderItem = async ({dispatch, analytics, order}) => {
  await dispatch(CartUtils.remove(order.id))
  await dispatch(CartUtils.view())
  analytics.logEvent('remove_from_cart', {
    user: order.user?.email || '',
  })
}

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

  const toggleInsurance = (id: string) => {
    dispatch(CartUtils.update({ id, insurance: !order.insurance })).then(() =>
      dispatch(CartUtils.view())
    )
  }

  const moveToFavorites = () => {
    dispatch(CartUtils.update({ id: order.id, status: 'list' })).then(() =>
      dispatch(CartUtils.view())
    )
  }

  return (
    <>
      <EditCartItem
        order={order}
        isOpen={editOrder}
        close={() => setEditOrder(false)}
      />
      <div
        className={`flex-row items-center p-4 rounded-sm relative bg-white
        ${!valid ? 'border border-warning' : ''}
        `}
      >
        <div className="mr-4">
          <Link href={`/shop/${product.designer.slug}/${product.slug}`}>
            <a className="h-32 w-32 relative">
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

        <div className="w-full">
          <div className="items-start
            md:items-stretch
            lg:flex-row w-full lg:items-center lg:justify-between
            ">
            <OrderInformation
              order={order}
              valid={valid}
              available={available}
            />
            <OrderPrice
              totalPrice={totalPrice}
              toggleInsurance={toggleInsurance}
              order={order}
            />
          </div>

          <div className="flex-row space-x-4">
            <button onClick={moveToFavorites} type="button">
              <span className="underline">move to favourites</span>
            </button>
            <button onClick={() => setEditOrder(true)} type="button">
              <span className="underline">edit</span>
            </button>
            <button
              onClick={() => removeOrderItem({dispatch, order, analytics})}
              type="button"
              aria-label="Remove checkout item"
            >
              <span className="underline">remove</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

const OrderPrice = ({ totalPrice, toggleInsurance, order }) => (
  <div className="w-full items-end lg:items-end">
    <div className="items-end space-y-2">
      <span>
        <strong>{fmtPrice(totalPrice)}</strong>
      </span>
      <div className="relative flex-row items-center">
        <Checkbox
          onChange={() => toggleInsurance(order.id)}
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
  const date = dayjs(order.startDate).tz('Europe/London') // order.startDate is utc
  const startDate = date.format('ddd, MMM D')
  const endDate = date
    .add(rentalLengths[order.rentalLength], 'day')
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

export const EditCartItem = ({ order, isOpen, close, onSubmit=() => {} }) => {
  const [dateVisible, setDateVisible] = React.useState(false)

  const dispatch = useDispatch()
  const fields = useFields<AddToCartFields>({
    size: { constraints: 'required', default: order.size },
    selectedDate: {
      label: 'Rental Date',
      constraints: 'required',
      default: dayjs(order.startDate),
    },
    rentalLength: { constraints: 'required', default: order.rentalLength },
    rentType: { default: 'OneTime' },
  })

  const updateOrder = async () => {
    const { id } = order
    const cleaned = fields.clean()
    await dispatch(
      CartUtils.update({
        id,
        startDate: cleaned.selectedDate.toJSON() as any,
        size: cleaned.size,
        rentalLength: cleaned.rentalLength,
        status: 'cart',
      })
    )
    await dispatch(CartUtils.view())
    onSubmit()
    close()
  }

  return (
    <Popup header={order.status === 'list' ? "Add to Cart" : "Edit Order"} close={close} isOpen={isOpen}>
      <div className="h-48 w-full relative">
        <Image
          layout="fill"
          objectFit="contain"
          {...productImageProps(order.product)}
        />
      </div>
      <Form fields={fields} onSubmit={updateOrder} resubmit>
        <DatePicker
          size={fields.value('size')}
          product={order.product}
          selectedDate={fields.value('selectedDate')}
          selectDate={(date) => fields.setValue('selectedDate', date)}
          visible={dateVisible}
          setVisible={(visible: boolean) => setDateVisible(visible)}
          rentalLength={fields.value('rentalLength')}
          previousDate={dayjs(order.startDate)}
        />

        <SelectRentalSize
          size={fields.get('size')}
          selectedDate={fields.get('selectedDate')}
          product={order.product}
        />
        <SelectRentalDate
          size={fields.get('size')}
          rentalLength={fields.get('rentalLength')}
          selectedDate={fields.get('selectedDate')}
          setVisible={(visible: boolean) => setDateVisible(visible)}
        />
        <div className="h-2" />
        <Submit
          form={fields.form}
          className="my-2 self-center rounded-sm w-full"
        >
          {order.status === 'list' ? 'Add to cart' : "Save changes"}
        </Submit>
      </Form>
    </Popup>
  )
}

export default Cart
