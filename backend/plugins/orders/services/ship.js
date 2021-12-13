'use strict'

const { day } = require('../../../utils')

async function shipToCleaners(cartItem) {
  const { order } = cartItem
  strapi.log.info('cleaning order %o', order.id)
  const shippingRequest = {
    collection:
      strapi.plugins['orders'].services.order.toShippingAddress(order),
    recipient: 'oxwash',
    shippingClass: 'two',
    shipmentPrice: strapi.plugins['orders'].services.price.orderTotal(order),
  }

  await strapi
    .query('order', 'orders')
    .update({ id: order.id }, { status: 'cleaning' })
  if (strapi.services.shipment.providerName !== 'acs') {
    const id = await strapi.services.shipment.ship(shippingRequest)
    await strapi
      .query('order', 'orders')
      .update({ id: order.id }, { shipment: id })
  }
  await strapi.services.template_email.orderLeaving(cartItem)
}

async function sendToCleaners(orders) {
  for (const order of orders) {
    const range = strapi.services.timing.range(order)
    const date = day(range.end)
    const today = day()
    if (!date.isSame(today, 'day')) {
      continue
    }

    const cartItem = await strapi.plugins[
      'orders'
    ].services.cart.createCartItem(order)

    shipToCleaners(order).catch((err) => shippingFailure(cartItem, err))
  }
}

async function shippingFailure(order, err) {
  await strapi
    .query('order', 'orders')
    .update({ id: order.id }, { status: 'error', message: err })
  await strapi.services.template_email.orderShippingFailure(order, err)
  strapi.log.error('failed to ship order to client %o', err)
}

async function shipCartItemToClient(cartItem) {
  const { order } = cartItem
  const shippingRequest = {
    collection: 'infinitecloset',
    recipient: strapi.plugins['orders'].services.order.toShippingAddress(order),
    shippingClass: strapi.services.timing.shippingClass(
      order.shippingDate,
      order.startDate
    ),
    shipmentPrice: cartItem.totalPrice,
    order,
  }

  await strapi.services.shipment
    .ship(shippingRequest)
    .then((res) =>
      strapi
        .query('order', 'orders')
        .update(
          { id: order.id },
          { shipment: res, status: 'shipping', shippingDate: day().toJSON() }
        )
    )
}

async function shipOrderToClient(order) {
  if (order.status === 'shipping') {
    throw new Error('Already shipping')
  }

  order = await strapi
    .query('order', 'orders')
    .findOne({ id: order.id }, ['address', 'product', 'user', 'product.sizes'])

  const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(
    order
  )
  await shipCartItemToClient(cartItem).catch((err) =>
    shippingFailure(order, err)
  )
  return cartItem
}

async function shipOrders(orders) {
  for (const order of orders) {
    if (
      order.status === 'planning' &&
      strapi.services.shipment.providerName === 'acs'
    ) {
      shipOrderToClient(order)
    }
  }
}

module.exports = {
  shipToCleaners,
  sendToCleaners,
  shippingFailure,
  shipCartItemToClient,
  shipOrderToClient,
  shipOrders,
}
