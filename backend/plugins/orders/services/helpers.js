'use strict'

async function notifyArrival(orders) {
  for (const order of orders) {
    const user = order.user
    const range = strapi.services.timing.range(order)
    const date = strapi.services.timing.day(range.start)
    const today = strapi.services.timing.day()

    if (!date.isSame(today, 'day')) continue
    // const complete = await strapi.services.shipment.complete(order.shipment)
    // if (!complete) return

    strapi.log.info('order arriving %o', order.id)
    strapi.plugins['email'].services.email.send({
      template: 'order-arriving',
      to: user.email,
      subject: `Your order of ${order.product.name} by ${order.product.designer.name} is arriving today`,
      data: {
        ...(await strapi.plugins['orders'].services.cart.createCartItem(order)),
        firstName: user.firstName,
      },
    })
  }
}

async function sendToCleaners(orders) {
  for (const order of orders) {
    const user = order.user
    const range = strapi.services.timing.range(order)
    const date = strapi.services.timing.day(range.end)
    const today = strapi.services.timing.day()
    if (!date.isSame(today, 'day')) continue

    const shippingRequest = {
      collection:
        strapi.plugins['orders'].services.order.toShippingAddress(order),
      recipient: 'oxwash',
      shippingClass: 'two',
      shipmentPrice: strapi.plugins['orders'].services.price.orderTotal(order),
    }

    strapi.log.info('cleaning order %o', order.id)
    strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'cleaning' })
      .then(() => strapi.services.shipment.ship(shippingRequest))
      .then(() => strapi.plugins['orders'].services.cart.createCartItem(order))
      .then((order) =>
        strapi.plugins['email'].services.email.send({
          template: 'order-leaving',
          to: user.email,
          cc: 'battersea@oxwash.com',
          subject: `Your order of ${order.product.name} by ${order.product.designer.name} is ending today`,
          data: {
            firstName: user.firstName,
            ...order,
          },
        })
      )
      .catch((err) =>
        strapi.plugins['orders'].services.helpers.shippingFailure(order, err)
      )
  }
}

async function shippingFailure(order, err) {
  await strapi
    .query('order', 'orders')
    .update({ id: order.id }, { status: 'error', message: err })
  await strapi.plugins['email'].services.email.send({
    template: 'order-shipping-failure',
    to: 'info@infinitecloset.co.uk',
    subject: 'Failed to ship order',
    data: { order, error: err },
  })
  strapi.log.error('failed to ship order to client %o', err)
}

async function notifyAction(orders) {
  orders = orders.filter((order) => {
    const range = strapi.services.timing.range(order)
    const today = strapi.services.timing.day()
    const shipped = strapi.services.timing.day(range.shipped)
    return today.isSame(shipped, 'day')
  })

  await strapi.plugins['email'].services.email.send({
    template: 'shipping-action',
    to: 'info@infinitecloset.co.uk',
    subject: 'Some orders need to be shipped today',
    data: {
      cart: await strapi.plugins['orders'].services.cart.create(orders),
    },
  })
}

module.exports = {
  shippingFailure,
  notifyArrival,
  sendToCleaners,
  notifyAction,
}
