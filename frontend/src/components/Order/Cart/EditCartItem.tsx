import Image from 'next/image'
import React from 'react'

import { StrapiOrder } from '@/types/models'
import dayjs from '@/utils/dayjs'
import { useDispatch } from '@/utils/store'

// import { productImageProps } from '@/Product/utils'
import { ProductImages } from '@/Product/ProductItem'
import { Popup } from '@/Layout'
import { AddToCartFields } from '@/Product/ProductPage/types'
import { useFields, Form, Submit } from '@/Form'

import { OrderUtils } from '@/Order'
import { DatePicker, SelectRentalDate, SelectRentalSize } from './AddToCart'

export const EditCartItem = ({ order, isOpen, close, onSubmit = () => {} }) => {
  const size = getOrderSize(order)
  const isPreorder = size.quantity === 0
  const dispatch = useDispatch()
  const fields = useFields<AddToCartFields>({
    size: { constraints: 'required', default: order.size },
    selectedDate: {
      label: 'Rental Date',
      constraints: 'required',
      default: dayjs(order.expectedStart || undefined),
    },
    rentalLength: { constraints: 'required', default: order.rentalLength },
    rentType: { default: 'OneTime' },
    visible: {},
  })

  const updateOrder = async () => {
    const { id } = order
    const cleaned = fields.clean()
    await dispatch(
      OrderUtils.update({
        id,
        expectedStart: cleaned.selectedDate.toJSON() as any,
        size: cleaned.size,
        rentalLength: cleaned.rentalLength,
        status: 'cart',
      })
    )
    await dispatch(OrderUtils.view())
    onSubmit()
    close()
  }

  return (
    <Popup
      header={order.status === 'list' ? 'Add to Cart' : 'Edit Order'}
      close={close}
      isOpen={isOpen}
    >
      <div className="relative"
        style={{
          width: '12rem',
          height: '12rem',
        }}
      >
        <ProductImages product={order.product} />
      </div>
      <Form fields={fields} onSubmit={updateOrder} resubmit>
        <DatePicker fields={fields} product={order.product} />

        <SelectRentalSize
          size={fields.get('size')}
          selectedDate={fields.get('selectedDate')}
          product={order.product}
        />
        <SelectRentalDate
          size={fields.get('size')}
          rentalLength={fields.get('rentalLength')}
          selectedDate={fields.get('selectedDate')}
          setVisible={(visible: boolean) => fields.setValue('visible', visible)}
        />
        <div className="h-2" />
        <Submit
          form={fields.form}
          className="my-2 self-center rounded-sm w-full"
        >
          {isPreorder && order.status === 'list'
            ? 'Pre-Order'
            : order.status === 'list'
            ? 'Add to cart'
            : 'Save changes'}
        </Submit>
        {isPreorder && (
          <span className="text-sm">
            *This item is not in stock so please allow a 2 week delay
          </span>
        )}
      </Form>
    </Popup>
  )
}

const getOrderSize = (order: StrapiOrder) =>
  order?.product?.sizes?.find((size) => size.size === order.size)
