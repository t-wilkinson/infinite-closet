'use strict'

const { generateAPI } = require('../../../utils')

module.exports = {
  ...generateAPI('order', 'orders'),

  // TODO: remove this, use PUT instead
  async complete(ctx) {
    const { order_id } = ctx.params
    const res = await strapi
      .query('order', 'orders')
      .update({ id: order_id }, { status: 'completed' })
    ctx.send({
      order: res,
    })
  },

  // TODO: should check if product.sizes includes order.size
  // Add to cart
  async create(ctx) {
    const body = ctx.request.body
    const user = ctx.state.user

    if (!['cart', 'list'].includes(body.status)) {
      return ctx.send({message: 'Order status must be \'cart\' or \'list\''}, 404)
    }

    const order = await strapi.query('order', 'orders').create({
      user: user ? user.id : undefined,
      status: body.status,
      size: body.size,
      product: body.product,
      startDate: body.startDate,
      rentalLength: body.rentalLength,
    })

    ctx.send(order)
  },

  async ship(ctx) {
    const { order_id } = ctx.params
    let order = await strapi.query('order', 'orders').findOne({ id: order_id })
    if (!order) {
      return ctx.send({}, 404)
    }

    try {
      const cartItem = await strapi.plugins['orders'].services.helpers.ship(order)
      await strapi.services.templateEmail.orderShipped(cartItem)
      const {order} = cartItem
      return ctx.send({ order })
    } catch (e) {
      return ctx.send({message: e.message}, 400)
    }
  },
}
