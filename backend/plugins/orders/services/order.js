'use strict'

// An array because it can be used in strapi filter
const inProgress = ['planning', 'shipping', 'cleaning']

/**
 * Represent individual product
 * @typedef {object} OrderProduct
 * @property {Size} size
 * @property {Product} product
 */

/**
 * Convert order to shipping address for shipments
 */
function toShippingAddress(order) {
  const { address, user } = order
  return {
    name: address.fullName,
    address: [address.addressLine1, address.addressLine2],
    town: address.town,
    postcode: address.postcode,
    email: address.email || user.email,
    phone: address.phoneNumber,
  }
}

/**
 * Find all orders that have the same {@link OrderProduct}
 * @param {OrderProduct}
 * @returns {Order[]}
 */
async function relevantOrders({ product, size }) {
  const productId = strapi.services.product.itemId(product)

  return await strapi.query('order', 'orders').find(
    {
      product: productId,
      size: size,
      status_in: inProgress,
    },
    []
  )
}

// TODO: Currently uses default granularity of a day as a sort of buffer.
// Eventually this should use a granularity of hours instead.
/**
 * Determines if the order lifecycle overlaps with given date
 * @param {DateLike|DateRange} startDate
 * @param {Order} order
 * @returns {boolean}
 */
function overlap(date, order) {
  if (!order.range) {
    // Save shipment.range() result as it can be expensive
    order.range = strapi.services.timing.range(order)
  }

  const overlaps =
    date &&
    inProgress.includes(order.status) &&
    strapi.services.timing.overlap(date, order.range)
  return overlaps
}

/**
 * Finds number of orders whose date range overlap with given date
 * @param {DateLike|DateRange} startDate
 * @param {Order[]} orders Orders that we are interested in overlaps with provided order
 * @returns {number}
 */
function totalOverlaps(date, orders) {
  const overlapCount = orders.reduce((acc, order) => {
    return overlap(date, order) ? acc + 1 : acc
  }, 0)

  return overlapCount
}

/**
 * Return total product quantity of some OrderProduct
 * @param {OrderProduct}
 * @returns {number}
 */
async function productQuantity({ size, product }) {
  // return either quantiy of product size or 0
  const getQuantity = (sizes) => {
    const foundSize = sizes.find((s) => s.size === size)
    if (foundSize) {
      return foundSize.quantity
    } else {
      return 0
    }
  }

  // `order` should either have product id or the product object
  if (product.sizes) {
    return getQuantity(product.sizes)
  } else if (product) {
    product = await strapi
      .query('product')
      .findOne({ id: product.id ? product.id : product }, ['sizes'])
    return getQuantity(product.sizes)
  } else {
    return 0
  }
}

/**
 * Helper function to calculate number of times an order can be ordered
 */
async function totalAvailable(order, orders) {
  const quantity = await productQuantity(order)
  const range = strapi.services.timing.range(order)
  const overlaps = totalOverlaps(range, orders)
  return quantity - overlaps
}

module.exports = {
  inProgress,
  productQuantity,
  toShippingAddress,
  overlap,
  totalOverlaps,
  relevantOrders,
  totalAvailable,
}
