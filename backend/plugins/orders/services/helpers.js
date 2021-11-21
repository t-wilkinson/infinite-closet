'use strict'

const {day} = require('../../../utils')

async function notifyArrival(orders) {
  for (const order of orders) {
    const range = strapi.services.timing.range(order)
    const date = day(range.start)
    const today = day()

    if (!date.isSame(today, 'day')) continue

    strapi.log.info('order arriving %o', order.id)

    const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(order)
    strapi.services.templateEmail.orderArriving(cartItem)
  }
}

async function shipToCleaners(order) {
  const shippingRequest = {
    collection:
    strapi.plugins['orders'].services.order.toShippingAddress(order),
    recipient: 'oxwash',
    shippingClass: 'two',
    shipmentPrice: strapi.plugins['orders'].services.price.orderTotal(order),
  }
  await strapi.services.shipment.ship(shippingRequest)
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

    strapi.log.info('cleaning order %o', order.id)
    strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'cleaning' })
      .then(() => {
        // acs automatically handles cleaning
        if (strapi.services.shipment.provider !== 'acs') {
          shipToCleaners(order)
        }
      })
      .then(() => strapi.services.templateEmail.orderLeaving(cartItem))
      .catch((err) =>
        strapi.plugins['orders'].services.helpers.shippingFailure(cartItem, err)
      )
  }
}

async function shippingFailure(order, err) {
  await strapi
    .query('order', 'orders')
    .update({ id: order.id }, { status: 'error', message: err })
  await strapi.services.templateEmail.orderShippingFailure(order, err)
  strapi.log.error('failed to ship order to client %o', err)
}

/**
 * Find orders that require manual action through the strapi plugin
 * and send an email reminder
 */
async function notifyAction(orders) {
  orders = orders.filter((order) => {
    const range = strapi.services.timing.range(order)
    const today = day()
    const shipped = day(range.shipped)
    return today.isSame(shipped, 'day')
  })

  if (orders.length === 0) {
    return
  }

  const cart = await strapi.plugins['orders'].services.cart.create(orders)
  strapi.services.templateEmail.shippingAction(cart)
}

async function ship(order) {
  if (order.status === 'shipping') {
    throw new Error('Already shipping')
  }

  order = await strapi.query('order', 'orders').update(
    { id: order.id },
    {
      status: 'shipping',
      shippingDate: day().toJSON(),
    }
  )
  order = await strapi
    .query('order', 'orders')
    .findOne({ id: order.id }, [
      'address',
      'product',
      'user',
      'product.designer',
      'product.images',
      'product.sizes',
    ])
  const cartItem = await strapi.plugins[
    'orders'
  ].services.cart.createCartItem(order)

  const shippingRequest = {
    collection: 'infinitecloset',
    recipient:
    strapi.plugins['orders'].services.order.toShippingAddress(order),
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
        .update({ id: order.id }, { shipment: res.id })
    )
    .catch((err) =>
      strapi.plugins['orders'].services.helpers.shippingFailure(order, err)
    )
  return cartItem
}

/**
 * Change stage of cart items to 'planning' and update other information
 */
async function toPlanning({cart, contact, paymentIntent, summary, address, paymentMethod}) {
  await Promise.allSettled(
    strapi.plugins['orders'].services.cart.orders(cart).map((order) =>
      strapi.query('order', 'orders').update(
        { id: order.id },
        {
          address,
          paymentIntent: paymentIntent
            ? paymentIntent.id
            : paymentIntent || null,
          paymentMethod: paymentMethod
            ? paymentMethod.id
            : paymentMethod || null,
          status: 'planning',
          coupon: summary.coupon ? summary.coupon.id : null,
          charge: strapi.plugins['orders'].services.price.orderTotal(order),
          fullName: contact.fullName,
          nickName: contact.nickName,
          email: contact.email,
        }
      )
    )
  ).then((settled) => {
    const failed = settled.filter((res) => res.status === 'rejected')
    if (failed.length > 0) {
      strapi.log.error('Failed to prepare cart for shipping', failed)
    }
  })
}


/**
 * On checkout, we need to:
 *  - Send an email to the client
 *  - Update information about orders
 */
async function onCheckout({
  contact,
  address,
  cart,
  summary,
  paymentIntent,
  paymentMethod,
}) {
  if (typeof address === 'object') {
    address = await strapi
      .query('address')
      .create({ ...address, email: contact.email })
    address = address.id
  }

  await toPlanning({cart, contact, paymentIntent, summary, address, paymentMethod})
  if (strapi.services.shipment.provider === 'acs') {
    const settled = await Promise.allSettled(cart.map(cartItem => strapi.plugins['orders'].services.helpers.ship(cartItem.order)))
    const failed = settled.filter((res) => res.status === 'rejected')
    if (failed.length > 0) {
      strapi.log.error('onCheckout: Failure to ship', failed)
    }
  }

  if (contact) {
    await strapi.services.contact.upsertContact(contact)
    await strapi.services.templateEmail.checkout({contact, summary, cart})
  }
}

module.exports = {
  onCheckout,
  ship,
  sendToCleaners,
  shippingFailure,
  notifyArrival,
  notifyAction,
}
