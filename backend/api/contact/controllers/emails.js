'use strict'

module.exports = {
  async sendToCleaners(ctx) {
    const { orderId } = ctx.params
    let order = await strapi
      .query('order', 'orders')
      .findOne({ id: orderId }, ['product', 'product.designer', 'user'])
    if (!order) {
      return ctx.send({}, 404)
    }

    const { user } = order
    const shippingRequest = {
      collection:
        strapi.plugins['orders'].services.order.toShippingAddress(order),
      recipient: 'oxwash',
      shippingClass: 'two',
      shipmentPrice: strapi.plugins['orders'].services.price.orderTotal(order),
    }

    const cartItem = await strapi.plugins[
      'orders'
    ].services.cart.createCartItem(order)

    // Ship order and send email to client
    strapi.log.info('cleaning order %o', order.id)
    strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'cleaning' })
      .then(() => strapi.services.shipment.ship(shippingRequest))
      .then(() =>
        strapi.plugins['email'].services.email.send({
          template: 'order-leaving',
          to: user.email,
          bcc:
            process.env.NODE_ENV === 'production'
              ? ['battersea@oxwash.com']
              : [],
          subject: `Your order of ${order.product.name} by ${order.product.designer.name} is ending today`,
          data: {
            firstName: user.firstName,
            ...cartItem,
          },
        })
      )
      .catch((err) =>
        strapi.plugins['orders'].services.helpers.shippingFailure(order, err)
      )
    return ctx.send()
  },

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
      bcc:
        process.env.NODE_ENV === 'production' ? ['battersea@oxwash.com'] : [],
      subject: `Your order of ${order.product.name} by ${order.product.designer.name} is ending today`,
      data: Object.assign(cartItem, {
        firstName: user.firstName,
      }),
    })

    return ctx.send()
  },
}
