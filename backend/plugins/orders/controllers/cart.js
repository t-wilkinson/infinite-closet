'use strict'

async function createCart(orders) {
  const numAvailable = await strapi.plugins[
    'orders'
  ].services.helpers.numAvailableCart(orders)

  // add price and available quantity to each order
  const cart = await Promise.all(
    orders.map(async (order) => {
      const key = strapi.plugins['orders'].services.order.toKey(order)
      const quantity = await strapi.plugins['orders'].services.order.quantity(
        order
      )

      const existingOrders = await strapi.query('order', 'orders').count({
        product: order.product.id || order.product,
        size: order.size,
        status_in: strapi.plugins['orders'].services.order.inProgress,
      })

      const valid = strapi.services.timing.valid(
        order.startDate,
        numAvailable[key],
        quantity,
        existingOrders
      )

      const order_ = await strapi
        .query('order', 'orders')
        .findOne({ id: order.id }, [
          'product.sizes',
          'product.images',
          'product.designer',
        ])

      return {
        order: order_,
        price: strapi.plugins['orders'].services.price.price(order),
        available: numAvailable[key],
        valid,
        shippingClass: strapi.services.shipment.shippingClass(
          order.created_at,
          order.startDate
        ),
      }
    })
  )

  return cart.filter((item) => item.order)
}

async function getUserCart(user) {
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
    const cart = body.cart
      .map((order) => (order.id ? order.id : order))
      .filter((v) => v)

    Promise.all(
      cart.map((order) =>
        strapi.query('order', 'orders').update({ id: order }, { user: user.id })
      )
    )

    strapi
      .query('user', 'users-permissions')
      .update({ id: user.id }, { orders: cart })

    ctx.send()
  },

  async priceSummary(ctx) {
    const { cart } = ctx.request.body
    const user = ctx.state.user

    const summary = await strapi.plugins['orders'].services.price.summary({
      cart,
      user,
    })
    ctx.send(summary)
  },

  async getUserCart(ctx) {
    const user = ctx.state.user
    const orders = await getUserCart(user)
    ctx.send(orders)
  },

  async viewUserCart(ctx) {
    const user = ctx.state.user
    const orders = await getUserCart(user)
    const cart = await createCart(orders)
    ctx.send(cart)
  },

  async viewGuestCart(ctx) {
    const body = ctx.request.body
    const orders = await Promise.all(
      body.cart.map(async (order) => {
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

    const cart = await createCart(orders)
    ctx.send(cart)
  },
}
