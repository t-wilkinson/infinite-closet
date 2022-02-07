'use strict'

const { day, toFullName } = require('../../../utils')

const on = {
  async confirmed({
    user,
    cart,
    contact,
    summary,
    address,
    paymentIntent,
    paymentMethod,
  }) {
    // Create/update address
    const addressParams = {
      email: contact.email,
      fullName: toFullName(contact),
    }
    switch (typeof address) {
      case 'object':
        address = await strapi
          .query('address')
          .create({ ...addressParams, ...address })
        break
      case 'string':
      case 'number':
        address = await strapi
          .query('address')
          .update({ id: address }, addressParams)
        break
    }

    // Validate address
    const isAddressValid = await strapi.services.shipment.validateAddress(
      address
    )
    if (!isAddressValid && process.env.NODE_ENV === 'production') {
      throw new Error('Expected a valid address.')
    }

    // Contact
    contact = await strapi.services.contact.upsertContact(contact)

    // Purchase
    const purchase = await strapi.query('purchase').create({
      paymentIntent: paymentIntent?.id,
      paymentMethod: paymentMethod?.id,
      charge: summary.total,
      coupon: summary.coupon?.id,
      giftCard: summary.giftCard?.id,
      giftCardDiscount: summary.giftCardDiscount,
      contact: contact?.id,
    })

    // Checkout
    const orderIds = strapi.plugins['orders'].services.cart
      .orders(cart)
      .map((order) => order.id)
    const checkout = await strapi.query('checkout').create({
      orders: orderIds,
      address: address.id,
      purchase: purchase.id,
      user: user?.id,
      contact: contact?.id,
    })

    const settled = await Promise.allSettled(
      strapi.plugins['orders'].services.cart.map(async (cartItem) => {
        const { order, shippingClass } = cartItem
        let shipmentId = null

        // ACS expects orders asap
        if (strapi.services.shipment.providerName === 'acs') {
          shipmentId = await strapi.plugins[
            'orders'
          ].services.ship.shipOrderToClient(cartItem.order)
        }

        // Shipment
        const shipment = await strapi.query('shipments').create({
          shippingClass,
          shipmentId,
          confirmed: day().toJSON(),
        })

        // Order
        await strapi.query('order', 'orders').update(
          { id: order.id },
          {
            contact: contact?.id,
            user: user?.id,
            address: address.id,
            status: 'shipping',
            shipment: shipment.id,
          }
        )
      })
    )

    const failed = settled
      .filter((res) => res.status === 'rejected')
      .map((res) => res.reason)
    if (failed.length > 0) {
      strapi.log.error('Failed to prepare cart for shipping', failed)
    }

    strapi.services.template_email.orderConfirmation({
      contact,
      summary,
      cart,
      address,
    })

    return checkout
  },

  async shipped(order) {
    const ship = strapi.plugins['orders'].services.ship

    // Send user email if their order is shipping today
    if (strapi.services.shipment.providerName === 'acs') {
      const cartItem = await strapi.plugins[
        'orders'
      ].services.cart.createCartItem(order)
      strapi.services.template_email.orderShipped(cartItem)
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
    // if (strapi.services.shipment.providerName !== 'acs') {
    //   await strapi.plugins['orders'].services.ship
    //     .shipToCleaners(order)
    //     .catch((err) =>
    //       strapi.plugins['orders'].services.ship.shippingFailure(cartItem, err)
    //     )
    // }
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
  const range = strapi.plugins['orders'].services.order.range(order)
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
  const orders = await getOrderLifecycles()

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
