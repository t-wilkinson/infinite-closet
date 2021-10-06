'use strict'
const orderUtils = require('./order')
const priceUtils = require('./price')

// calculate number of available products for each cart item
async function numAvailable(orders = []) {
  const reqRanges = orders.reduce((acc, order) => {
    const key = orderUtils.toKey(order)
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(strapi.services.timing.range(order))
    return acc
  }, {})

  // attach `sizes` component to `order.product.sizes`
  orders = await strapi.query('order', 'orders').find({}, [])
  orders = await Promise.all(
    orders.map(async (order) => {
      order.product = await strapi
        .query('product')
        .findOne({ id: order.product }, ['sizes'])
      return order
    })
  )

  return orderUtils.numAvailable(orders, reqRanges)
}

async function createCartItem(order) {
  order = await strapi
    .query('order', 'orders')
    .findOne({ id: order.id }, [
      'product.sizes',
      'product.images',
      'product.designer',
    ])

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
  const quantity = await orderUtils.quantity(order)
  const key = orderUtils.toKey(order)

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
