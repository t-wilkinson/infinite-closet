'use strict'

// Email templates need undefined body to supply defaults
const toTemplateData = (body) => Object.values(body).filter(v => v).length === 0 ? undefined : body

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
    const data = toTemplateData(ctx.request.body)
    console.log(data)
    if (!data) {
      await strapi.services.template_email[email]()
    } else {
      const { orderId } = ctx.request.body
      const { cartItem } = await getCartItem(orderId)
      await strapi.services.template_email[email](cartItem)
    }
    return ctx.send(null)
  } catch (e) {
    strapi.log.error('Failed to send email', e.stack)
    return ctx.badRequest(e.message)
  }
}

module.exports = {
  async orderConfirmation(ctx) {
    const data = toTemplateData(ctx.request.body)
    if (!data) {
      strapi.services.template_email.orderConfirmation()
      return ctx.send(null)
    } else {
      // const { userId, orderIds } = ctx.request.body
      return ctx.badRequest('Not yet implemented')
    }
    // TODO!
    // const user = await strapi.query('user', 'users-permissions').findOne({ id: userId })
    // const orders = await strapi.query('user', 'users-permissions').find({ id_in: orderIds })

    // strapi.services.template_email.orderConfirmation({
    //   firstName: user.firstName,
    //   summary,
    //   cart,
    //   address,
    // })
  },

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
    return ctx.badRequest('Not yet implemented')
    // try {
    //   let { firstName} = ctx.request.body
    //   await strapi.services.template_email.storeCredit({ firstName })
    //   return ctx.send(null)
    // } catch (e) {
    //   return ctx.badRequest(e.message)
    // }
  },
}
