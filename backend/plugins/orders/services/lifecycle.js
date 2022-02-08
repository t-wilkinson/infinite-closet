'use strict'

const { toId, day } = require('../../../utils')

const lifecycles = {
  async confirmed(cartItem) {
    const { order } = cartItem
    // let shipmentId = null

    // ACS expects orders asap
    if (strapi.services.shipment.providerName === 'acs') {
      await strapi.plugins['orders'].services.ship.shipOrderToClient(order)
      // shipmentId = res.shipmentId
    }

    //     // Shipment
    //     const shipment = await strapi.query('shipment').update(
    //       { id: toId(order.shipment) },
    //       {
    //         shipmentId,
    //       }
    //     )

    // // Order
    // await strapi.query('order', 'orders').update(
    //   { id: order.id },
    //   {
    //     shipment: shipment.id,
    //   }
    // )
  },

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

  let orders = {}
  for (const order of allOrders) {
    const status = order.shipment.status
    if (!orders[status]) {
      orders[status] = []
    }
    orders[status].push(order)
  }

  return orders
}

async function on(status, order, ...props) {
  // If order does not have a shipment, we create one
  const shipmentId = toId(order.shipment)

  const changeShipment = (props) => {
    if (shipmentId) {
      return strapi.query('shipment').update({ id: shipmentId }, props)
    } else {
      return strapi.query('shipment').create(props)
    }
  }

  const shipment = await changeShipment({
    status,
    [status]: day().toJSON(),
  })

  const changeOrder = (props) => {
    if (!shipmentId) {
      strapi
        .query('order', 'orders')
        .update({ id: toId(order), shipment: toId(shipment) }, props)
    } else {
      strapi.query('order', 'orders').update({ id: toId(order) }, props)
    }
  }

  if (status === 'completed') {
    changeOrder({ status: 'completed' })
  } else if (status === 'confirmed' || order.status !== 'shipping') {
    changeOrder({ status: 'shipping' })
  }

  const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(
    order
  )

  return await lifecycles[status](cartItem, ...props)
}

/**
 * Forward every order lifecycle
 */
async function forwardAll() {
  const statuses = strapi.models.shipment.attributes.status.enum
  const orders = await getOrderLifecycles()

  const today = day()
  /**
   * Check if order is changing to status today, so we can run respective lifecycle code
   */
  function statusChangingToday(order, nextStatus) {
    const range = strapi.plugins['orders'].services.order.range(order)
    const statusChangeDate = day(range[nextStatus])
    if (statusChangeDate.isSame(today, 'day')) {
      return true
    }
  }

  for (const status in orders) {
    const index = statuses.indexOf(status)
    if (index === statuses.length - 1) {
      continue
    }

    for (const order of orders[status]) {
      const nextStatus = statuses[index + 1]
      if (!statusChangingToday(order, nextStatus)) {
        continue
      }
      on(status, order)
    }
  }
}

module.exports = {
  on,
  forwardAll,
}
