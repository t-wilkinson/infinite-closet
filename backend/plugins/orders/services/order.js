'use strict'

const inConfirmed = ['shipping', 'completed']
const inProgress = ['shipping']

/**
 * Determines if the order lifecycle overlaps with given date
 * @param {DateLike|DateRange} expectedStart
 * @param {Order} order
 * @returns {boolean}
 */
function overlap(date, order) {
  const range = strapi.plugins['orders'].services.order.range(order)

  const overlaps =
    date &&
    inProgress.includes(order.status) &&
    strapi.services.timing.overlap(date, range)
  return overlaps
}

/**
 * Finds number of orders whose date range overlap with given date
 * @param {DateLike|DateRange} expectedStart
 * @param {Order[]} orders Orders that we are interested in overlaps with provided order
 * @returns {number}
 */
function totalOverlaps(date, orders) {
  return orders.reduce((acc, order) => {
    return overlap(date, order) ? acc + 1 : acc
  }, 0)
}

/**
 * Helper function to calculate number of times an order can be ordered
 */
async function totalAvailable(order, orders) {
  const quantity = await strapi.services.product.quantity(order)
  const range = strapi.plugins['orders'].services.order.range(order)
  const overlaps = totalOverlaps(range, orders)
  return quantity - overlaps
}

function shippingClass({ shipment, expectedStart }) {
  return strapi.services.timing.shippingClass(shipment?.shipped, expectedStart)
}

function range({ expectedStart, rentalLength, shipment }) {
  return strapi.services.timing.range({ expectedStart, rentalLength, shipment })
}

module.exports = {
  overlap,
  totalOverlaps,
  totalAvailable,
  range,
  shippingClass,

  inProgress,
  inConfirmed,
}
