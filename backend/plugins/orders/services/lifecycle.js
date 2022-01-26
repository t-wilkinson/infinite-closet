'use strict'

const { day } = require('../../../utils')

const on = {
  async confirmed({
    cart,
    contact,
    summary,
    address,
    paymentIntent,
    paymentMethod,
  }) {
    const settled = await Promise.allSettled(
      strapi.plugins['orders'].services.cart.orders(cart).map((order) =>
        strapi.query('order', 'orders').update(
          { id: order.id },
          {
            address,
            paymentIntent,
            paymentMethod,
            status: 'planning',
            charge: strapi.plugins['orders'].services.price.orderPriceTotal(order),

            giftCard: summary.giftCard ? summary.giftCard.id : null,
            giftCardDiscount: summary.giftCardDiscount,
            coupon: summary.coupon ? summary.coupon.id : null,
            // couponDiscount: summary.couponDiscount,

            fullName: contact.fullName || null,
            nickName: contact.nickName || null,
            email: contact.email || null,
          }
        )
      )
    )

    const failed = settled.filter((res) => res.status === 'rejected')
    if (failed.length > 0) {
      strapi.log.error('Failed to prepare cart for shipping', failed)
    }

    // acs expects orders asap
    if (strapi.services.shipment.providerName === 'acs') {
      const settled = await Promise.allSettled(
        cart.map((cartItem) =>
          strapi.plugins['orders'].services.ship.shipOrderToClient(
            cartItem.order
          )
        )
      )
      const failed = settled.filter((res) => res.status === 'rejected')
      if (failed.length > 0) {
        strapi.log.error('onCheckout: Failed to ship', failed)
        throw new Error('Failed to ship order')
      }
    }

    // Create contact and send email
    if (contact) {
      await strapi.services.contact.upsertContact(contact)
      strapi.services.template_email.orderConfirmation({
        firstName: contact.nickName,
        summary,
        cart,
        address,
      })
    }
  },

  async shipped(order) {
    const ship = strapi.plugins['orders'].services.ship

    // Send user email if their order is shipping today
    if (strapi.services.shipment.providerName === 'acs') {
      await strapi.plugins['orders'].services.cart
        .createCartItem(order)
        .then((cartItem) =>
          strapi.services.template_email.orderShipped(cartItem)
        )
        .catch((err) => ship.shippingFailure(order, err))
    } else {
      await ship.shipOrderToClient(order)
    }
  },

  async start(order) {
    const cartItem = await strapi.plugins[
      'orders'
    ].services.cart.createCartItem(order)
    strapi.services.template_email.orderStarting(cartItem)
  },

  async end(order) {
    const cartItem = await strapi.plugins[
      'orders'
    ].services.cart.createCartItem(order)

    await strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'cleaning' })
    if (strapi.services.shipment.providerName !== 'acs') {
      await strapi.plugins['orders'].services.ship
        .shipToCleaners(order)
        .catch((err) =>
          strapi.plugins['orders'].services.ship.shippingFailure(cartItem, err)
        )
    }
    await strapi.services.template_email.orderEnding(cartItem)
  },

  async cleaning(order) {
    await strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'cleaning' })
  },

  async completed(order) {
    strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'completed' })
    const cartItem = await strapi.plugins[
      'orders'
    ].services.cart.createCartItem(order)
    strapi.services.template_email.orderReceived(cartItem)
    strapi.services.template_email.orderReview(cartItem)
  },
}

/**
 * Check if order is changing to status today, so we can run respective lifecycle code
 */
function statusChangingToday(order, status) {
  const range = strapi.services.timing.range(order)
  const date = day(range[status])
  const today = day()
  if (!date.isSame(today, 'day')) {
    return false
  }

  strapi.log.info(`order ${order.id} changing status to ${status}`)
  return true
}

/**
 * Call order lifecycle function if it changes to given status today
 */
function forwardOrder(order, status) {
  if (!statusChangingToday(order, status)) {
    return
  }
  on[status](order)
}

function forwardOrders(orders, status) {
  for (const order of orders) {
    forwardOrder(order, status)
  }
}

async function getOrderLifecycles() {
  // Separate orders by status
  const orders = {
    all: await strapi
      .query('order', 'orders')
      .find({ status_in: ['planning', 'shipping', 'cleaning'] }, [
        'product',
        'product.designer',
        'user',
        'address',
        'coupon',
      ]),
  }

  for (const order of orders.all) {
    if (!orders[order.status]) {
      orders[order.status] = []
    }
    orders[order.status].push(order)
  }

  return orders
}

/**
 * Forward every order lifecycle
 */
async function forwardAll() {
  const orders = getOrderLifecycles()

  forwardOrders(orders.planning, 'shipped')
  forwardOrders(orders.shipping, 'start')
  forwardOrders(orders.shipping, 'end')
  forwardOrders(orders.cleaning, 'completed')
}

module.exports = {
  on,
  forwardAll,
  forwardOrders,
  forwardOrder,
}
