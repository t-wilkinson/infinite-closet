'use strict'

const _ = require('lodash')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const dayjs = require('dayjs')

async function createCart(orders) {
  const numAvailable = await strapi.plugins[
    'orders'
  ].services.order.numAvailableCart(orders)

  // add price and available quantity to each order
  return await Promise.all(
    orders.map(async (order) => {
      const key = strapi.plugins['orders'].services.order.toKey(order)
      const quantity = await strapi.plugins['orders'].services.order.quantity(
        order
      )
      const valid = strapi.plugins['orders'].services.date.valid(
        order.startDate,
        numAvailable[key],
        quantity
      )

      return {
        ...order,
        price: strapi.plugins['orders'].services.price.price(order),
        available: numAvailable[key],
        valid,
        shippingClass:
          strapi.plugins['orders'].services.date.shippingClass(order),
      }
    })
  )
}

module.exports = {
  async count(ctx) {
    const user = ctx.state.user

    const count = await strapi
      .query('order', 'orders')
      .count({ user: user.id, status: 'cart' })
    ctx.send({ count })
  },

  // TODO: should this calculate the coupon amount as well?
  // if so, must rate limit this endpoint
  async totalPrice(ctx) {
    const body = ctx.request.body

    const total = await strapi.plugins['orders'].services.price.totalPrice({
      cart: body.cart.filter((order) => order.valid),
      insurance: body.insurance,
    })
    ctx.send(total)
  },

  async totalUserPrice(ctx) {
    const body = ctx.request.body
    const user = ctx.state.user

    const total = await strapi.plugins['orders'].services.price.totalPrice({
      cart: body.cart.filter((order) => order.valid),
      insurance: body.insurance,
      user,
    })
    ctx.send(total)
  },

  // !TODO
  async setCart(ctx) {
    // const body = ctx.request.body
    // const user = ctx.state.user
    //     strapi.query('user', 'users-permissions').update({id: user.id}, {
    //       orders: body.orders
    //     })

    ctx.send()
  },

  async getUserCart(ctx) {
    const user = ctx.state.user
    const orders = await strapi.query('order', 'orders').find(
      {
        user: user.id,
        status: 'cart',
      },
      ['product', 'product.sizes', 'product.designer', 'product.images']
    )

    const cart = await createCart(orders)
    ctx.send({
      cart,
    })
  },

  async create(ctx) {
    const body = ctx.request.body
    const orders = await Promise.all(
      body.cart.map(async (order) => {
        if (typeof order.product === 'number') {
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
    ctx.send({
      cart,
    })
  },

  // TODO: remove this, use PUT instead
  async removeCartItem(ctx) {
    const { id } = ctx.params
    const order = await strapi
      .query('order', 'orders')
      .update({ id }, { status: 'dropped' })
    ctx.send({
      order,
    })
  },

  async checkout(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body
    const numAvailable = await strapi.plugins[
      'orders'
    ].services.order.numAvailableCart(body.cart)

    let cart = await Promise.allSettled(
      body.cart.map(async (order) => {
        const key = strapi.plugins['orders'].services.order.toKey(order)
        const quantity = await strapi.plugins['orders'].services.order.quantity(
          order
        )
        const valid = strapi.plugins['orders'].services.date.valid(
          order.startDate,
          numAvailable[key],
          quantity
        )

        if (valid) {
          return strapi.query('order', 'orders').create({
            ..._.omit(order, ['id']),
            address: body.address,
            paymentMethod: body.paymentMethod,
            status: 'planning',
            insurance: body.insurance[order.id] || false,
          })
        } else {
          return Promise.reject(
            `${dayjs(order.startDate)} is not is available for this item`
          )
        }
      })
    )

    cart = cart
      .filter((v) => v.status === 'fulfilled')
      .map((value) => value.value)
    const price = await strapi.plugins['orders'].services.price.totalPrice({
      cart,
      insurance: body.insurance,
      user,
    })
    const coupon = await strapi.services.coupon.discount({
      code: body.couponCode,
      situation: 'checkout',
      price: price.total,
    })
    const total = strapi.plugins['orders'].services.price.toAmount(
      coupon.valid ? coupon.price : price.total
    )

    stripe.paymentIntents
      .create({
        amount: total,
        currency: 'gbp',
        customer: user.customer,
        payment_method: body.paymentMethod,
        off_session: false,
        confirm: true,
      })

      .then((paymentIntent) =>
        Promise.allSettled(
          cart.map((order) =>
            strapi
              .query('order', 'orders')
              .update({ id: order.id }, { paymentIntent: paymentIntent.id })
          )
        )
      )

      .then((settled) =>
        settled
          .filter((settle) => settle.status == 'fulfilled')
          .map((settle) => settle.value)
      )

      .then((orders) =>
        Promise.all(
          orders.map(async (order) => ({
            ...order,
            product: {
              ...order.product,
              designer: await strapi
                .query('designer')
                .findOne({ id: order.product.designer }),
            },
            range: strapi.plugins['orders'].services.date.range(order),
            price: strapi.plugins['orders'].services.price.price(order),
          }))
        )
      )

      .then((orders) =>
        strapi.plugins['email'].services.email.send({
          template: 'checkout',
          to: user.email,
          subject: 'Thank you for your order',
          bcc: 'infinitecloset.co.uk+6c3ff2e3e1@invite.trustpilot.com',
          data: {
            firstName: user.firstName,
            orders,
            totalPrice: strapi.plugins['orders'].services.price.toPrice(total),
          },
        })
      )

      .catch((err) => strapi.log.error(err))

    ctx.send({
      checkedOut: cart,
    })
  },
}

/* Incase we want to charge user during shipment(not checkout)
stripe.paymentIntents
  .create({
    amount,
    currency: "gbp",
    customer: user.customer,
    payment_method: order.paymentMethod,
    off_session: true,
    confirm: true,
  })

  .then((paymentIntent) =>
    strapi
      .query("order", "orders")
      .update({ id: order.id }, { paymentIntent: paymentIntent.id })
  )
*/
