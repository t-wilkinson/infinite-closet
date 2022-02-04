'use strict'
const _ = require('lodash')
const { generateAPI } = require('../../../utils')

module.exports = {
  ...generateAPI('order', 'orders'),

  async complete(ctx) {
    return ctx.badRequest('Not implemented')
    // const { order_id } = ctx.params
    // await strapi
    //   .query('order', 'orders')
    //   .update({ id: order_id }, { status: 'completed' })
    // ctx.send(null)
  },

  // TODO: should check if product.sizes includes order.size
  // Add to cart
  async create(ctx) {
    const body = ctx.request.body
    const user = ctx.state.user

    if (!['cart', 'list'].includes(body.status)) {
      return ctx.badRequest("Order status must be 'cart' or 'list'")
    }

    const contact = await strapi.services.contact.upsertContact(strapi.services.contact.toContact(user))
    const orderBody = _.omitBy({
      user: user?.id || user,
      contact,
      status: body.status,
      size: body.size,
      product: body.product,
      expectedStart: body.expectedStart,
      rentalLength: body.rentalLength,
    }, _.isNil)
    const order = await strapi.query('order', 'orders').create(orderBody)

    ctx.send(strapi.plugins['orders'].services.cart.sanitizeOrder(order))
  },

  async ship(ctx) {
    const { order_id } = ctx.params
    let order = await strapi.query('order', 'orders').findOne({ id: order_id })
    if (!order) {
      return ctx.send(null, 404)
    }

    try {
      const cartItem = await strapi.plugins[
        'orders'
      ].services.ship.shipOrderToClient(order)
      await strapi.services.template_email.orderShipped(cartItem)
      const { order } = cartItem
      return ctx.send({ order: strapi.plugins['orders'].services.cart.sanitizeOrder(order) })
    } catch (e) {
      return ctx.send({ message: e.message }, 400)
    }
  },
}
