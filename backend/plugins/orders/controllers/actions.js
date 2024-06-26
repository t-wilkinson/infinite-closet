'use strict'

module.exports = {
  async ship(ctx) {
    const { orderId } = ctx.request.body
    const order = await strapi.query('order', 'orders').findOne({ id: orderId })
    if (!order) {
      return ctx.badRequest(`Could not find order ${orderId}`)
    }

    const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(order)
    const shippingData = await strapi.plugins['orders'].services.ship.prepareToShip(cartItem)
    const shippingRequest = {
      collection: 'infinitecloset',
      recipient: shippingData.address,
      rental: shippingData.rental,
    }
    const shipmentId = await strapi.services.shipment.ship(shippingRequest)
    strapi.log.info('shipping action', {
      shippingRequest, shipmentId
    })
    return ctx.send(null)
  }
}
