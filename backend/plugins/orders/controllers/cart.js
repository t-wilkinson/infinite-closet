'use strict'

async function getUserOrders(user) {
  const orders = await strapi
    .query('order', 'orders')
    .find({ user: user.id, status: 'cart' }, [
      'product',
      'product.sizes',
      'product.designer',
      'product.images',
    ])
  return orders
}

module.exports = {
  async count(ctx) {
    const user = ctx.state.user

    const count = await strapi
      .query('order', 'orders')
      .count({ user: user.id, status: 'cart' })
    ctx.send(count)
  },

  async setCart(ctx) {
    const body = ctx.request.body
    const user = ctx.state.user
    const orders = body.orders
      .map((order) => (order.id ? order.id : order))
      .filter((v) => v)

    Promise.all(
      orders.map((order) =>
        strapi.query('order', 'orders').update({ id: order }, { user: user.id })
      )
    )

    strapi
      .query('user', 'users-permissions')
      .update({ id: user.id }, { orders })

    ctx.send()
  },

  async priceSummary(ctx) {
    const { orders } = ctx.request.body
    const user = ctx.state.user
    const cart = await strapi.plugins['orders'].services.cart.createValidCart(
      orders
    )
    const summary = await strapi.plugins['orders'].services.price.summary({
      cart,
      user,
    })
    ctx.send(summary)
  },

  async getUserOrders(ctx) {
    const user = ctx.state.user
    const orders = await getUserOrders(user)
    ctx.send(orders)
  },

  async viewUserCart(ctx) {
    const user = ctx.state.user
    const orders = await getUserOrders(user)
    const cart = await strapi.plugins['orders'].services.cart.create(orders)
    ctx.send(cart)
  },

  async viewGuestCart(ctx) {
    const body = ctx.request.body
    const orders = await Promise.all(
      body.orders.map(async (order) => {
        if (['number', 'string'].includes(typeof order.product)) {
          const product = await strapi.query('product').findOne(
            {
              id: order.product,
            },
            ['sizes', 'designer', 'images']
          )
          return { ...order, product }
        } else {
          return order
        }
      })
    )

    const cart = await strapi.plugins['orders'].services.cart.create(orders)
    console.log({ body: body.orders, orders, cart })
    ctx.send(cart)
  },
}
