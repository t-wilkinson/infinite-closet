'use strict'

async function getUserOrders(user, status) {
  const orders = await strapi.query('order', 'orders').find(
    {
      user: user.id,
      ...(!status
        ? {}
        : Array.isArray(status)
        ? { status_in: status }
        : { status: status }),
    },
    ['review']
  )
  await Promise.all(
    orders.map(async (order) => {
      order.product = await strapi
        .query('product')
        .findOne({ id: order.product }, ['sizes', 'designer', 'images'])
    })
  )

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

    ctx.send(null)
  },

  async priceSummary(ctx) {
    const { orders } = ctx.request.body
    const user = ctx.state.user
    // error with contact and status
    const cart = await strapi.plugins['orders'].services.cart.createValidCart(
      orders
    )
    try {
      // error with status twice
      const summary = await strapi.plugins['orders'].services.price.summary({
        cart,
        user,
      })
      ctx.send(strapi.services.price.sanitizeSummary(summary))
    } catch (e) {
      ctx.send(null, 404)
    }
  },

  async getUserFavorites(ctx) {
    const user = ctx.state.user
    const orders = await getUserOrders(user, 'list')
    ctx.send(strapi.plugins['orders'].services.cart.sanitizeOrders(orders))
  },

  async getUserOrders(ctx) {
    const user = ctx.state.user
    const orders = await getUserOrders(user, 'cart')
    ctx.send(strapi.plugins['orders'].services.cart.sanitizeOrders(orders))
  },

  async viewUserCart(ctx) {
    const user = ctx.state.user
    const orders = await getUserOrders(user, 'cart')
    const cart = await strapi.plugins['orders'].services.cart.create(orders)
    ctx.send(strapi.plugins['orders'].services.cart.sanitizeCart(cart))
  },

  async viewGuestCart(ctx) {
    const body = ctx.request.body
    const orders = await Promise.all(
      body.orders
        .filter((order) => order.status === 'cart')
        .map(async (order) => {
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
    ctx.send(strapi.plugins['orders'].services.cart.sanitizeCart(cart))
  },

  async viewUserOrderHistory(ctx) {
    const user = ctx.state.user
    const orders = await getUserOrders(user, ['shipping', 'completed'])
    const cart = await strapi.plugins['orders'].services.cart.create(orders)
    ctx.send(strapi.plugins['orders'].services.cart.sanitizeCart(cart))
  },
}
