'use strict'
const orderUtils = require('./order')
const priceUtils = require('./price')

// calculate number of available products for each cart item
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
  // TODO: speed this up
  order = await strapi
    .query('order', 'orders')
    .findOne({ id: order.id }, [
      'product.sizes',
      'product.images',
      'product.designer',
      ...(order.user ? ['user'] : []),
    ])
  order.product.sizes = await strapi
    .query('product')
    .findOne({ id: order.product.id }, ['sizes'])
    .then((res) => res.sizes)

  return {
    order,
    ...priceUtils.orderPrice(order),
    totalPrice: priceUtils.orderTotal(order),
    range: strapi.services.timing.range(order),
    shippingClass: strapi.services.shipment.shippingClass(
      order.shippingDate,
      order.startDate
    ),
  }
}

async function createAvailableCartItem(numAvailableOrders, order) {
  const quantity = await orderUtils.productQuantity(order)
  const key = strapi.services.product.toKey(order)

  const existingOrders = await strapi.query('order', 'orders').count({
    product: order.product.id || order.product,
    size: order.size,
    status_in: orderUtils.inProgress,
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

module.exports = {
  create,
  createCartItem,
  numAvailable,

  createValidCart,
  validItems,
  validOrders,
  orders,
}
