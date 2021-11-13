'use strict'

module.exports = {
  async orderLeaving(ctx) {
    const { orderId } = ctx.params
    let order = await strapi
      .query('order', 'orders')
      .findOne({ id: orderId }, ['product', 'product.designer', 'user'])
    if (!order) {
      return ctx.send({}, 404)
    }

    const { user } = order
    const cartItem = await strapi.plugins[
      'orders'
    ].services.cart.createCartItem(order)
    strapi.log.error('sending mail', cartItem.totalPrice)

    strapi.plugins['email'].services.email.send({
      template: 'order-leaving',
      to: user.email,
      bcc: 'battersea@oxwash.com',
      subject: `Your order of ${order.product.name} by ${order.product.designer.name} is ending today`,
      data: Object.assign(cartItem, {
        firstName: user.firstName,
      }),
    })

    return ctx.send({})
  },
}
