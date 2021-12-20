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

async function defaultCartItemEmail(ctx, email) {
  try {
    const { orderId } = ctx.params
    const { cartItem } = await getCartItem(orderId)
    await strapi.services.template_email[email](cartItem)
    return ctx.send(null)
  } catch (e) {
    strapi.log.error('Failed to send email', e.stack)
    return ctx.badRequest(e.message)
  }
}

module.exports = {
  async orderShipped(ctx) {
    await defaultCartItemEmail(ctx, 'orderShipped')
  },

  async orderStarting(ctx) {
    await defaultCartItemEmail(ctx, 'orderStarting')
  },

  async orderEnding(ctx) {
    await defaultCartItemEmail(ctx, 'orderEnding')
  },

  //   async sendToCleaners(ctx) {
  //     const { orderId } = ctx.params
  //     const { cartItem, order } = await getCartItem(orderId)

  //     // Ship order and send email to client
  //     strapi.plugins['orders'].services.ship
  //       .shipCartItemToClient(cartItem)
  //       .catch((err) =>
  //         strapi.plugins['orders'].services.ship.shippingFailure(order, err)
  //       )
  //     return ctx.send(null)
  //   },

  async trustPilot(ctx) {
    await defaultCartItemEmail(ctx, 'trustPilot')
  },
}
