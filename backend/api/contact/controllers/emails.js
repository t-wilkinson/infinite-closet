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
    const { orderId } = ctx.request.body
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

  async orderEnding(ctx) {
    await defaultCartItemEmail(ctx, 'orderEnding')
  },

  async orderReceived(ctx) {
    await defaultCartItemEmail(ctx, 'orderReceived')
  },

  async orderReview(ctx) {
    await defaultCartItemEmail(ctx, 'orderReview')
  },

  async trustPilot(ctx) {
    await defaultCartItemEmail(ctx, 'trustPilot')
  },

  async giftCard(ctx) {
    try {
      let { firstName, giftCardId } = ctx.request.body
      const giftCard = await strapi.query('gift-card').find({ id: giftCardId })
      await strapi.services.template_email.giftCard({ firstName, giftCard })
      return ctx.send(null)
    } catch (e) {
      return ctx.badRequest(e.message)
    }
  },

  async storeCredit() {
    // try {
    //   let { firstName} = ctx.request.body
    //   await strapi.services.template_email.storeCredit({ firstName })
    //   return ctx.send(null)
    // } catch (e) {
    //   return ctx.badRequest(e.message)
    // }
  },
}
