'use strict'

const { toId } = require('../../../utils')

// An array because it can be used in strapi filter
const inProgress = ['planning', 'shipping', 'cleaning', 'error']

/**
 * Represent individual product
 * @typedef {object} OrderProduct
 * @prop {Size} size
 * @prop {Product} product
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
  const productId = toId(product)

  return await strapi.query('order', 'orders').find(
    {
      product: productId,
      size: size,
      status_in: inProgress,
    },
    []
  )
}

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
async function orderQuantity({ size, product }) {
  // `order` should either have product id or the product object
  if (product.sizes) {
    return strapi.services.size.quantity(product.sizes, size)
  } else if (product) {
    product = await strapi
      .query('product')
      .findOne({ id: product.id ? product.id : product }, ['sizes'])
    return strapi.services.size.quantity(product.sizes, size)
  } else {
    return 0
  }
}

/**
 * Helper function to calculate number of times an order can be ordered
 */
async function totalAvailable(order, orders) {
  const quantity = await orderQuantity(order)
  const range = strapi.services.timing.range(order)
  const overlaps = totalOverlaps(range, orders)
  return quantity - overlaps
}

function toAcsUniqueSKU({ product, size }, existing = 0) {
  return `IC-${toId(product)}_${existing + 1}-${size}`
}

async function acsUniqueSKU(order) {
  const orders = await strapi.query('order', 'orders').find({
    product: toId(order.product),
    size: order.size,
    status: strapi.plugins['orders'].services.order.inProgress,
  })
  return toAcsUniqueSKU(order, orders.length)
}

module.exports = {
  inProgress,
  toShippingAddress,

  toAcsUniqueSKU,
  acsUniqueSKU,

  overlap,
  totalOverlaps,
  relevantOrders,

  totalAvailable,
  orderQuantity,
}
