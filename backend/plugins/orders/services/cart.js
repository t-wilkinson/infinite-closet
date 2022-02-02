'use strict'
const { sanitizeEntity } = require('strapi-utils')
const { toId } = require('../../../utils')

/**
 * @typedef CartItem
 * @prop {object} order
 * @prop {number} totalPrice
 * @prop {number} shippingPrice
 * @prop {number} insurancePrice
 * @prop {number} productPrice
 * @prop {DateRange} range
 * @prop {ShippingClass} shippingClass
 */

/**
 * For each order, find the number of existing orders whose lifecycle overlaps
 * @param {Order[]} orders
 * @returns {object<string,number>}
 */
async function numAvailable(orders = []) {
  const available = {}

  for (const order of orders) {
    const key = strapi.services.product.toKey(order)
    if (available[key]) {
      continue
    }

    const relevantOrders = await strapi.plugins[
      'orders'
    ].services.order.relevantOrders(order)
    available[key] = await strapi.plugins[
      'orders'
    ].services.order.totalAvailable(order, relevantOrders)
  }

  return available
}

async function createCartItem(order) {
  order = await strapi
    .query('order', 'orders')
    .findOne({ id: toId(order) }, [
      'address',
      'product.sizes',
      'product.images',
      'product.designer',
      'user',
    ])
  order.product.sizes = await strapi
    .query('product')
    .findOne({ id: order.product.id }, ['sizes'])
    .then((res) => res.sizes)
  const price = strapi.plugins['orders'].services.price.orderPrice(order)

  return {
    order,
    ...price,
    totalPrice: Object.values(price).reduce((total, price) => total + price, 0),
    range: strapi.services.timing.range(order),
    shippingClass: strapi.services.timing.shippingClass(
      order.shippingDate,
      order.startDate
    ),
  }
}

/**
 * @param CartItem
 */
function unpackCartItem(cartItem) {
  return {
    cartItem,
    order: cartItem.order,
    user: cartItem.order.user,
  }
}

async function createAvailableCartItem(numAvailableOrders, order) {
  const quantity = await strapi.plugins['orders'].services.order.orderQuantity(order)
  const key = strapi.services.product.toKey(order)

  const existingOrders = await strapi.query('order', 'orders').count({
    product: toId(order.product),
    size: order.size,
    status_in: strapi.plugins['orders'].services.order.orderQuantity.inProgress,
  })

  const valid = strapi.services.timing.valid(
    order.startDate,
    numAvailableOrders[key],
    quantity,
    existingOrders
  )

  return {
    ...(await createCartItem(order)),
    valid,
    available: numAvailableOrders[key],
  }
}

async function create(orders) {
  const numAvailableOrders = await numAvailable(orders)

  // add price and available quantity to each order
  const settledOrders = await Promise.allSettled(
    orders.map((order) => createAvailableCartItem(numAvailableOrders, order))
  )

  return settledOrders
    .filter((v) => v.status === 'fulfilled')
    .map((value) => value.value)
}

async function createValidCart(orders) {
  const cart = await create(orders)
  return validItems(cart)
}

function validItems(cart) {
  return cart.filter((item) => item.valid)
}

function orders(cart) {
  return cart.map((item) => item.order)
}

function validOrders(cart) {
  return orders(validItems(cart))
}

function sanitizeOrder(order) {
  return sanitizeEntity(order, {
    model: strapi.query('order', 'orders').model,
  })
}

function sanitizeOrders(orders) {
  return orders.map(sanitizeOrder)
}

function sanitizeCart(cart) {
  return cart.map((cartItem) => ({
    ...cartItem,
    order: sanitizeOrder(cartItem.order),
  }))
}

module.exports = {
  create,
  createCartItem,
  unpackCartItem,
  numAvailable,

  createValidCart,
  validItems,
  validOrders,
  orders,

  sanitizeOrder,
  sanitizeCart,
  sanitizeOrders,
}
