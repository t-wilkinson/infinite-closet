'use strict'

async function getCartItem(orderId) {
  let order = await strapi
    .query('order', 'orders')
    .findOne({ id: orderId }, [
      'address',
      'product',
      'product.designer',
      'product.sizes',
      'user',
    ])
  if (!order) {
    throw new Error(`Order id ${orderId} could not be found`)
  }

  const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(
    order
  )

  return {
    cartItem,
    order: cartItem.order,
    user: cartItem.order.user,
  }
}

module.exports = {
  async sendToCleaners(ctx) {
    const { orderId } = ctx.params
    const { cartItem, order } = await getCartItem(orderId)

    // Ship order and send email to client
    strapi.plugins['orders'].services.ship
      .shipCartItemToClient(cartItem)
      .catch((err) =>
        strapi.plugins['orders'].services.ship.shippingFailure(order, err)
      )
    return ctx.send({})
  },

  async orderLeaving(ctx) {
    const { orderId } = ctx.params
    const { cartItem } = await getCartItem(orderId)
    strapi.services.template_email.orderLeaving(cartItem)
    return ctx.send({})
  },

  async trustPilot(ctx) {
    const { orderId } = ctx.params
    const { cartItem } = await getCartItem(orderId)
    strapi.services.template_email.trustPilot(cartItem)
    return ctx.send({})
  },
}
