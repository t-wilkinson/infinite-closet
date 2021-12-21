'use strict'

const { day } = require('../../../utils')

async function shipToCleaners(cartItem) {
  const { order } = cartItem
  const shippingRequest = {
    collection:
      strapi.plugins['orders'].services.order.toShippingAddress(order),
    recipient: 'oxwash',
    cartItem,
  }

  const id = await strapi.services.shipment.ship(shippingRequest)
  await strapi
    .query('order', 'orders')
    .update({ id: order.id }, { shipment: id })
}

async function ordersEnding(orders) {
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

    await strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'cleaning' })
    if (strapi.services.shipment.providerName !== 'acs') {
      await shipToCleaners(order).catch((err) => shippingFailure(cartItem, err))
    }
    await strapi.services.template_email.orderEnding(cartItem)
  }
}

async function shippingFailure(order, err) {
  await strapi
    .query('order', 'orders')
    .update({ id: order.id }, { status: 'error', message: err })
  await strapi.services.template_email.orderShippingFailure(order, err)
  strapi.log.error('Failed to ship order to client %o', err.stack)
}

async function shipCartItemToClient(cartItem) {
  const { order } = cartItem
  if (order.status === 'shipping') {
    throw new Error('Already shipping')
  }

  const shippingRequest = {
    collection: 'infinitecloset',
    recipient: strapi.plugins['orders'].services.order.toShippingAddress(order),
    cartItem,
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

  const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(
    order
  )
  await shipCartItemToClient(cartItem).catch((err) =>
    shippingFailure(cartItem.order, err)
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
  ordersEnding,
  shippingFailure,
  shipCartItemToClient,
  shipOrderToClient,
  shipOrders,
}
