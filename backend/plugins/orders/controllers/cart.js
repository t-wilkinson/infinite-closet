'use strict'

const _ = require('lodash')
const stripe = require('stripe')(process.env.STRIPE_KEY)

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

      const existingOrders = await strapi.query('order', 'orders').count({
        product: order.product.id || order.product,
        size: order.size,
      })

      const valid = strapi.services.timing.valid(
        order.startDate,
        numAvailable[key],
        quantity,
        existingOrders
      )

      return {
        ...order,
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
}

async function createValidOrders({ cart, address, paymentMethod, insurance }) {
  const numAvailable = await strapi.plugins[
    'orders'
  ].services.order.numAvailableCart(cart)

  let settledOrders = await Promise.allSettled(
    cart.map(async (order) => {
      const key = strapi.plugins['orders'].services.order.toKey(order)
      const quantity = await strapi.plugins['orders'].services.order.quantity(
        order
      )
      const existingOrders = await strapi
        .query('order', 'orders')
        .count({ product: order.product.id, size: order.size })

      const valid = strapi.services.timing.valid(
        order.startDate,
        numAvailable[key],
        quantity,
        existingOrders
      )

      if (valid) {
        return strapi.query('order', 'orders').create({
          ..._.omit(order, ['id']),
          address: address,
          paymentMethod: paymentMethod,
          status: 'planning',
          insurance: insurance[order.id] || false,
        })
      } else {
        return Promise.reject(
          `${strapi.services.timing
            .day(order.startDate)
            .toJSON()} is not is available for this item`
        )
      }
    })
  )

  return settledOrders
    .filter((v) => v.status === 'fulfilled')
    .map((value) => value.value)
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

  // TODO: This needs to be refactored
  async checkout(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body

    let cart = await createValidOrders({
      cart: body.cart,
      address: body.address,
      paymentMethod: body.paymentMethod,
      insurance: body.insurance,
    })
    const { total, coupon } = await strapi.plugins[
      'orders'
    ].services.price.checkoutTotal({
      cart,
      insurance: body.insurance,
      user,
      couponCode: body.couponCode,
    })

    const filterSettled = (settled) =>
      settled
        .filter((settle) => settle.status == 'fulfilled')
        .map((settle) => settle.value)

    const attachPaymentIntent = (paymentIntent) =>
      Promise.allSettled(
        cart.map((order) =>
          strapi
            .query('order', 'orders')
            .update(
              { id: order.id },
              { paymentIntent: paymentIntent.id, coupon }
            )
        )
      )

    const fillOrderData = (orders) =>
      Promise.allSettled(
        orders.map(async (order) => ({
          ...order,
          product: {
            ...order.product,
            designer: await strapi
              .query('designer')
              .findOne({ id: order.product.designer }),
          },
          range: strapi.services.timing.range(order),
          price: strapi.plugins['orders'].services.price.price(order),
        }))
      )

    const successEmail = (orders) =>
      strapi.plugins['email'].services.email.send({
        template: 'checkout',
        to: user.email,
        cc:
          process.env.NODE_ENV === 'production'
            ? 'ukinfinitecloset@gmail.com'
            : '',
        bcc: 'infinitecloset.co.uk+6c3ff2e3e1@invite.trustpilot.com',
        subject: 'Thank you for your order',
        data: {
          firstName: user.firstName,
          orders,
          totalPrice: strapi.services.price.toPrice(total),
        },
      })

    stripe.paymentIntents
      .create({
        amount: total,
        currency: 'gbp',
        customer: user.customer,
        payment_method: body.paymentMethod,
        off_session: false,
        confirm: true,
      })
      .then((paymentIntent) => attachPaymentIntent(cart, paymentIntent))
      .then(filterSettled)
      .then(fillOrderData)
      .then(filterSettled)
      .then(successEmail)
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
