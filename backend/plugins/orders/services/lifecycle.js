'use strict'

const { toId, day } = require('../../../utils')

async function onProcessing() {
}

async function onConfirm() {
}

const lifecycles = {
  async shipped(cartItem) {
    // Send user email if their order is shipping today
    if (strapi.services.shipment.providerName !== 'acs') {
      await strapi.plugins['orders'].services.ship.shipOrderToClient(
        cartItem.order
      )
    }
    await strapi.services.template_email.orderShipped(cartItem)
  },

  async start() {},

  async end() {},

  async cleaning(cartItem) {
    await strapi.services.template_email.orderReceived(cartItem)
  },

  async completed(cartItem) {
    await strapi.services.template_email.orderReview(cartItem)
  },
}

/**
 * Handle intricacies of changing order/shipment status
 */
async function forwardOrderStatus(status, order) {
  // If order does not have a shipment, we create one
  const shipmentId = toId(order.shipment)
  const shipmentProps = {
    status,
    [status]: day().toJSON(),
  }
  if (shipmentId) {
    await strapi.query('shipment').update({ id: shipmentId }, shipmentProps)
  } else {
    const shipment = await strapi.query('shipment').create(shipmentProps)
    strapi
      .query('order', 'orders')
      .update({ id: toId(order) }, { shipment: toId(shipment) })
  }

  const changeOrder = (props) => {
    strapi.query('order', 'orders').update({ id: toId(order) }, props)
  }
  if (status === 'completed') {
    order = changeOrder({ status: 'completed' })
  } else if (status === 'confirmed' || order.status !== 'shipping') {
    order = changeOrder({ status: 'shipping' })
  }
  return order
}

async function on(status, order, ...props) {
  order = await forwardOrderStatus(status, order)
  const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(
    order
  )
  return await lifecycles[status](cartItem, ...props)
}

async function getOrderLifecycles() {
  // Separate orders by status
  const allOrders = await strapi
    .query('order', 'orders')
    .find({ status_in: ['shipping'] }, [
      'product',
      'product.designer',
      'user',
      'contact',
      'address',
      'shipment',
    ])

  let orders = {
    all: allOrders,
  }
  for (const order of allOrders) {
    const status = order.shipment.status
    if (!orders[status]) {
      orders[status] = []
    }
    orders[status].push(order)
  }

  return orders
}

/**
 * Check if order is changing to status today, so we can run respective lifecycle code
 */
function statusChangingToday(order, nextStatus) {
  const today = day()
  if (!nextStatus) {
    return false
  }
  const range = strapi.plugins['orders'].services.order.range(order)
  const statusChangeDate = day(range[nextStatus])
  if (statusChangeDate.isSame(today, 'day')) {
    return true
  }
}

function forwardOrder(order, nextStatus) {
  if (!statusChangingToday(order, nextStatus)) {
    return
  }
  return on(nextStatus, order)
}

/**
 * Forward every order lifecycle
 */
async function forwardAll() {
  const statuses = strapi.models.shipment.attributes.status.enum
  const orders = await getOrderLifecycles()

  for (const status in orders) {
    if (status === 'all') {
      continue
    }
    const index = statuses.indexOf(status)
    if (index === statuses.length - 1) {
      continue
    }

    for (const order of orders[status]) {
      const nextStatus = statuses[index + 1]
      forwardOrder(order, nextStatus)
    }
  }

  return orders
}

module.exports = {
  on,
  forwardAll,

  // Testing
  forwardOrder,
  forwardOrderStatus,
}
