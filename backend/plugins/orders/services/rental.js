'use strict'
const { toId } = require('../../../utils')

/**
 * Represent individual product
 * @typedef {object} Rental
 * @prop {Size} size
 * @prop {Product} product
 */

async function numOrdersInProgress({ product, size }) {
  return await strapi.query('order', 'orders').count({
    product: toId(product),
    size,
    status: 'shipping',
  })
}

/**
 * Find all orders that have the same {@link Rental} (shipping or completed)
 * @returns {Order[]}
 */
async function existingOrders({ product, size }) {
  return await strapi.query('order', 'orders').count({
    product: toId(product),
    size,
    status_in: strapi.plugins['orders'].services.order.inConfirmed,
  })
}

async function numExistingOrders({ product, size }) {
  return await strapi.query('order', 'orders').count({
    product: toId(product),
    size,
    status_in: strapi.plugins['orders'].services.order.inConfirmed,
  })
}

module.exports = {
  numOrdersInProgress,
  existingOrders,
  numExistingOrders,
}
