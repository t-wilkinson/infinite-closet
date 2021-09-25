'use strict'

const inProgress = ['planning', 'shipping', 'cleaning']

/**
 * Allow us to group orders by the unique products they refer to
 * @param {object} obj
 * @param {ID|Product} obj.product
 * @param {Size} obj.size
 * @return {string} Unique key
 */
function toKey(order) {
  let productID
  if (order.product === undefined) {
    productID = undefined
  } else if (order.product.id !== undefined) {
    productID = order.product.id
  } else {
    productID = order.product
  }
  return `${order.size}_${productID}`
}

/**
 * Calculate available product quantities by date based on overlapping orders
 * @param {object[]} orders
 * @param {object.<string, DateRange[]>} dates
 * @param dates.key
 */
function numAvailable(orders, dates) {
  const numAvailable = orders.reduce((counter, order) => {
    const key = toKey(order)
    const { product } = order
    if (!order.range) {
      order.range = strapi.services.timing.range(order)
    }

    // set default available product quantity
    if (!(key in counter)) {
      const defaultSize = { quantity: 0 }
      const productSize =
        product.sizes.find(({ size }) => size === order.size) || defaultSize
      counter[key] = productSize.quantity
    }

    // no dates will overlap
    if (!(key in dates)) {
      return counter
    }

    // if date ranges overlap, reduce available product quantity
    const overlaps = dates[key].reduce((acc, date) => {
      if (acc) {
        return acc
      }
      const overlaps =
        date &&
        inProgress.includes(order.status) &&
        strapi.services.timing.overlap(date, order.range)
      return overlaps
    }, false)

    if (overlaps) {
      counter[key] -= 1
    }

    return counter
  }, {})

  return numAvailable
}

/**
 * Total quantity of associated product
 * @param {Order} order
 * @returns number
 */
async function quantity(order) {
  if (!order.product.sizes) {
    order.product = await strapi.query('product').findOne(
      {
        id:
          typeof order.product === 'number' ? order.product : order.product.id,
      },
      ['sizes']
    )
  }
  const size = order.product.sizes.find((size) =>
    strapi.services.size.contains(order, size.size)
  )
  if (size) {
    return size.quantity
  } else {
    return 0
  }
}

/**
 * Convert order to shipping address for shipments
 */
function toShippingAddress(order) {
  const { address, user } = order
  return {
    name: address.firstName + ' ' + address.lastName,
    address: [address.address],
    town: address.town,
    postcode: address.postcode,
    email: user.email,
    phone: user.phoneNumber,
  }
}

module.exports = {
  toKey,
  quantity,
  inProgress,
  toShippingAddress,
  numAvailable,
}
