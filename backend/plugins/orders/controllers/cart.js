'use strict'

const _ = require('lodash')
const stripe = require('stripe')(process.env.STRIPE_KEY)

async function createCart(orders) {
  const numAvailable = await strapi.plugins[
    'orders'
  ].services.helpers.numAvailableCart(orders)

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

async function getValidOrders({ cart, address, paymentMethod }) {
  const numAvailable = await strapi.plugins[
    'orders'
  ].services.helpers.numAvailableCart(cart)

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
        return strapi.query('order', 'orders').update(
          { id: order.id },
          {
            address,
            paymentMethod,
            status: 'planning',
            insurance: order.insurance,
          }
        )
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

const generateResponse = (intent) => {
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
    }
  } else if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true,
    }
  } else {
    // Invalid status
    return {
      error: 'Invalid PaymentIntent status',
    }
  }
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
    ctx.send(cart)
  },

  // TODO: easy to fake ownership of cart
  async checkout(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body

    let cart = await getValidOrders({
      cart: body.cart,
      address: body.address,
      paymentMethod: body.paymentMethod,
    })
    let { total, coupon } = await strapi.plugins[
      'orders'
    ].services.price.summary({
      cart,
      user,
      couponCode: body.couponCode,
    })
    total = strapi.services.price.toAmount(total)

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

    const successEmail = (orders) => {
      if (!user) {
        return
      }
      return strapi.plugins['email'].services.email.send({
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
    }

    if (user) {
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
      return ctx.send()
    } else {
      try {
        let intent
        if (body.paymentMethod) {
          intent = await stripe.paymentIntents.create({
            payment_method: body.paymentMethod,
            amount: total,
            currency: 'gbp',
            confirm: true,
            confirmation_method: 'manual',
          })
        } else if (body.paymentIntent) {
          intent = await stripe.paymentIntents.confirm(body.paymentIntent)
        }

        const response = generateResponse(intent)

        if (response.success) {
          attachPaymentIntent(cart, intent)
            .then(filterSettled)
            .then(fillOrderData)
            .then(filterSettled)
            .then(successEmail)
            .catch((err) => strapi.log.error(err))
        }

        return ctx.send(response)
      } catch (e) {
        strapi.log.error(e)
        return ctx.send({ error: 'Could not process payment' })
      }
    }
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
