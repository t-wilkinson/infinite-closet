'use strict'

const { day } = require('../../../utils')

async function notifyArrival(orders) {
  for (const order of orders) {
    const range = strapi.services.timing.range(order)
    const date = day(range.start)
    const today = day()

    if (!date.isSame(today, 'day')) continue

    strapi.log.info('order arriving %o', order.id)

    const cartItem = await strapi.plugins[
      'orders'
    ].services.cart.createCartItem(order)
    strapi.services.template_email.orderArriving(cartItem)
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
        if (strapi.services.shipment.providerName !== 'acs') {
          shipToCleaners(order)
        }
      })
      .then(() => strapi.services.template_email.orderLeaving(cartItem))
      .catch((err) =>
        strapi.plugins['orders'].services.helpers.shippingFailure(cartItem, err)
      )
  }
}

async function shippingFailure(order, err) {
  await strapi
    .query('order', 'orders')
    .update({ id: order.id }, { status: 'error', message: err })
  await strapi.services.template_email.orderShippingFailure(order, err)
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
  strapi.services.template_email.shippingAction(cart)
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
  const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(
    order
  )

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
async function toPlanning({
  cart,
  contact,
  paymentIntent,
  summary,
  address,
  paymentMethod,
}) {
  const settled = await Promise.allSettled(
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
          charge: strapi.services.price.toAmount(
            strapi.plugins['orders'].services.price.orderTotal(order)
          ),
          fullName: contact.fullName,
          nickName: contact.nickName,
          email: contact.email,
        }
      )
    )
  )

  const failed = settled.filter((res) => res.status === 'rejected')
  if (failed.length > 0) {
    strapi.log.error('Failed to prepare cart for shipping', failed)
  }
}

/**
 * @typedef {object} Contact
 * @prop {string} fullName
 * @prop {string} nickName
 * @prop {string} email
 */

/**
 * Core function used by all checkout methods which handles administrative tasks
 * On checkout, we need to:
 *  - Validate address
 *  - Update information about orders (change status, etc.)
 *  - Send an email to the client
 */
async function onCheckout({
  contact,
  address,
  cart,
  summary,
  paymentIntent,
  paymentMethod,
}) {
  // Create/update address
  const mergeParams = { email: contact.email, fullName: contact.fullName }
  switch (typeof address) {
    case 'object':
      address = await strapi
        .query('address')
        .create({ ...mergeParams, ...address })
      break
    case 'string':
    case 'number':
      address = await strapi
        .query('address')
        .update({ id: address }, mergeParams)
      break
  }

  // Validate address
  const isAddressValid = await strapi.services.shipment.validateAddress(address)
  if (!isAddressValid) {
    throw new Error('Expected a valid address.')
  }

  // Update information for orders in cart
  await toPlanning({
    cart,
    contact,
    paymentIntent,
    summary,
    address,
    paymentMethod,
  })

  // acs expects orders asap
  if (strapi.services.shipment.providerName === 'acs') {
    const settled = await Promise.allSettled(
      cart.map((cartItem) =>
        strapi.plugins['orders'].services.helpers.ship(cartItem.order)
      )
    )
    const failed = settled.filter((res) => res.status === 'rejected')
    if (failed.length > 0) {
      strapi.log.error('onCheckout: Failure to ship', failed)
    }
  }

  // Create contact and send email
  if (contact) {
    await strapi.services.contact.upsertContact(contact)
    await strapi.services.template_email.checkout({ contact, summary, cart })
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
