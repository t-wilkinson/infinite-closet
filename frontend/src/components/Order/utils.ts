import { toast } from 'react-toastify'

import axios from '@/utils/axios'
import * as sizing from '@/utils/sizing'
import { currency } from '@/utils/config'
import { productRentalPrice } from '@/Product/utils'

import { OrderUtils } from './slice'

const prepareOrder = ({ product, fields, user }) => {
  const size = sizing.get(product.sizes, fields.get('size').value)
  const selectedDate = fields.get('selectedDate').value
  const rentalLength = fields.get('rentalLength').value

  const order: any = {
    user: user ? user.id : null,
    size: sizing.unnormalize(size.size),
    product: product.id,
    expectedStart: selectedDate ? selectedDate.toJSON() : undefined,
    rentalLength: rentalLength ? rentalLength : undefined,
  }
  return order
}

const productToItem = (product) => {
  return {
    item_id: product.id,
    item_name: product.name,
    item_brand: product.designer.name,
    // item_category: order.,
    price: product.retailPrice,
    quantity: 1,
  }
}

export const addToCart = async ({
  product,
  fields,
  user,
  dispatch,
  analytics,
}) => {
  const order = { ...prepareOrder({ product, fields, user }), status: 'cart' }

  return dispatch(OrderUtils.add(order))
    .then(() => {
      toast.success(`Successfully added to cart.`, {
        autoClose: 1500,
        hideProgressBar: true,
      }),
        analytics.logEvent('add_to_cart', {
          currency,
          value: productRentalPrice(product, order.rentalLength),
          user: user ? user.email : 'guest',
          items: [
            productToItem(product)
          ],
        })
    })
    .catch(() => {
      toast.error(`Unable to add to cart`, {})
    })
}

export const addToFavorites = async ({
  product,
  fields,
  user,
  dispatch,
  analytics,
}) => {
  try {
    const order = { ...prepareOrder({ product, fields, user }), status: 'list' }
    await dispatch(OrderUtils.add(order))
    await dispatch(OrderUtils.favorites())
    toast.success(`Successfully added to favorites.`, {
      autoClose: 1500,
      hideProgressBar: true,
    })
    analytics.logEvent('add_to_wishlist', {
      currency,
      value: productRentalPrice(product, order.rentalLength),
      items: [
         productToItem(product)
      ],
    })
  } catch (e) {
    console.log(e)
    toast.error(
      `Ran into an issue adding to favorites. We'll have this fixed soon!`,
      {}
    )
  }
}

export const removeOrderItem = async ({ dispatch, analytics, order }) => {
  const { product } = order
  await dispatch(OrderUtils.remove(order.id))
  await dispatch(OrderUtils.view())
  analytics.logEvent('remove_from_cart', {
    currency,
    value: productRentalPrice(product, order.rentalLength),
    items: [
      productToItem(product)
    ],
  })
}

export const toggleInsurance = ({ dispatch, order }) => {
  dispatch(
    OrderUtils.update({ id: order.id, insurance: !order.insurance })
  ).then(() => dispatch(OrderUtils.view()))
}

export const moveToFavorites = ({ order, dispatch }) => {
  dispatch(OrderUtils.update({ id: order.id, status: 'list' })).then(() => {
    dispatch(OrderUtils.view())
    dispatch(OrderUtils.favorites())
  })
}

export const getValidOrderDates = ({ product, dates, size, rentalLength }) =>
  axios
    .post(
      '/orders/dates/valid',
      {
        dates,
        product: product.id,
        size: (sizing.get(product.sizes, size) || product.sizes[0]).size,
        rentalLength,
      },
      { withCredentials: false }
    )
    .then((data) => data.valid)
    .catch((err) => {
      toast.error(`We ran into an issue verifying the available dates.`)
    })

export const availableOrderDates = async ({
  date,
  product,
  size,
  rentalLength,
}) => {
  const curDay = date.hour(12).date(1)
  const dates = [
    curDay.date(0).subtract(1, 'month'),
    curDay.date(0),
    curDay.add(1, 'month').date(0),
    curDay.add(2, 'month').date(0),
    curDay.add(3, 'month').date(0),
  ].reduce((acc, day) => {
    Array(day.date())
      .fill(0)
      .map((_, i) => {
        acc.push(day.set('date', i + 1))
      })
    return acc
  }, [])

  // TODO: should not refetch everytime new date overed over
  return await getValidOrderDates({ product, size, rentalLength, dates })
}

const rentalLengths = {
  short: 4 - 1,
  long: 8 - 1,
}

export const getRentalLength = (rentalLength: 'short' | 'long') =>
  rentalLengths[rentalLength]
