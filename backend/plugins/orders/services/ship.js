'use strict'
const { day, toId } = require('../../../utils')

async function prepareToShip(cartItem) {
  const { order } = cartItem
  const { id, product, size } = order
  const address = toShippingAddress(order)
  const count = await strapi.plugins[
    'orders'
  ].services.rental.numOrdersInProgress({ product, size })

  return {
    address,
    rental: {
      ...cartItem,
      id,
      product,
      size,
      numInProgress: count,
      charge: cartItem.totalPrice,
    },
  }
}

/**
 * Convert order to shipping address for shipments
 */
function toShippingAddress(order) {
  const { address, user } = order
  return {
    name: address.fullName,
    address: [address.addressLine1, address.addressLine2],
    town: address.town,
    postcode: address.postcode,
    email: address.email || user.email,
    phone: address.phoneNumber,
  }
}

async function shippingFailure(order, err) {
  const shipmentId = toId(order?.shipment)
  if (shipmentId) {
    await strapi
      .query('shipment')
      .update({ id: toId(order?.shipment) }, { status: 'delayed' })
  }
  await strapi.services.template_email.orderShippingFailure(order, err)
  strapi.log.error('Failed to ship order to client %o', err.stack)
}

async function shipCartItemToClient(cartItem) {
  const { order } = cartItem
  const data = await prepareToShip(cartItem)
  const shippingRequest = {
    collection: 'infinitecloset',
    recipient: data.address,
    rental: data.rental,
  }

  const shipmentId = await strapi.services.shipment.ship(shippingRequest)
  await strapi.query('shipment').update(
    { id: toId(order.shipment) },
    {
      shipped: day().toJSON(),
      shipmentId,
    }
  )
  return shipmentId
}

async function shipOrderToClient(order) {
  const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(
    order
  )
  const shipmentId = await shipCartItemToClient(cartItem).catch((err) =>
    shippingFailure(cartItem.order, err)
  )
  return { cartItem, shipmentId }
}

// async function shipOrders(orders) {
//   for (const order of orders) {
//     if (
//       order.status === 'planning' &&
//       strapi.services.shipment.providerName !== 'acs'
//     ) {
//       shipOrderToClient(order)
//     }
//   }
// }

// async function shipToCleaners(cartItem) {
//   const { order } = cartItem
//   const data = await prepareToShip(cartItem)
//   const shippingRequest = {
//     collection: data.address,
//     recipient: 'oxwash',
//     rental: data.rental,
//   }

//   const shipmentId = await strapi.services.shipment.ship(shippingRequest)
//   await strapi
//     .query('shipment')
//     .update({ id: toId(order?.shipment) }, { shipmentId })
// }

module.exports = {
  // shipToCleaners,
  // shippingFailure,
  shipOrderToClient,
  prepareToShip,
}
