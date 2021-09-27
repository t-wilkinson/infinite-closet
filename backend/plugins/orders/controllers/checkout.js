'use strict'
const stripe = require('stripe')(process.env.STRIPE_KEY)

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

async function shipOrders({
  user,
  cart,
  paymentIntent,
  address,
  paymentMethod,
  couponCode,
}) {
  cart = await strapi.plugins['orders'].services.helpers
    .getValidOrders(cart)
    .then((orders) =>
      Promise.all(
        orders.map((order) =>
          strapi.query('order', 'orders').update(
            { id: order.id },
            {
              address,
              paymentMethod,
              status: 'planning',
              insurance: order.insurance,
            }
          )
        )
      )
    )

  const summary = await strapi.plugins['orders'].services.price.summary({
    cart,
    user,
    couponCode,
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
            { paymentIntent: paymentIntent.id, coupon: summary.coupon }
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
        totalPrice: summary.total,
      },
    })
  }

  return attachPaymentIntent(cart, paymentIntent)
    .then(filterSettled)
    .then(fillOrderData)
    .then(filterSettled)
    .then(successEmail)
    .catch((err) => strapi.log.error(err))
}

async function prepareCheckout(body, user = null) {
  const cart = await strapi.plugins['orders'].services.helpers.getValidOrders(
    body.cart
  )

  const summary = await strapi.plugins['orders'].services.price.summary({
    cart,
    user,
    couponCode: body.couponCode,
  })

  if (body.paymentIntent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      body.paymentIntent
    )
    return { summary, cart, paymentIntent }
  } else {
    return { summary, cart }
  }
}

module.exports = {
  async checkoutUser(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body
    const { paymentIntent, summary, cart } = await prepareCheckout(body, user)
    if (cart.length === 0 || summary.amount < 100) {
      return ctx.send()
    }

    if (
      // TODO: what if only some paymentIntents match?
      // Only use paymentIntent created by the server
      // Don't use paymentIntent passed from client
      cart[0].paymentIntent === paymentIntent.id &&
      paymentIntent.status === 'succeeded'
    ) {
      shipOrders({ ...body, user, cart, paymentIntent })
      return ctx.send()
    } else {
      stripe.paymentIntents
        .create({
          amount: summary.amount,
          currency: 'gbp',
          customer: user.customer,
          payment_method: body.paymentMethod,
          off_session: false,
          confirm: true,
        })
        .then((paymentIntent) =>
          shipOrders({ ...body, user, cart, paymentIntent })
        )
      return ctx.send()
    }
  },

  async checkoutRequestGuest(ctx) {
    const body = ctx.request.body
    const { paymentIntent, summary, cart } = await prepareCheckout(body)
    if (cart.length === 0 || summary.amount < 100) {
      return ctx.send()
    }

    if (
      // TODO: what if only some paymentIntents match?
      // Only use paymentIntent created by the server
      // Don't use paymentIntent passed from client
      cart[0].paymentIntent === paymentIntent.id &&
      paymentIntent.status === 'succeeded'
    ) {
      shipOrders({ ...body, cart, paymentIntent })
      return ctx.send()
    } else {
      strapi.log.error('PaymentRequest paymentIntent did not succeed %o', {
        cart: cart.map((order) => order.id),
        paymentIntent,
      })
    }
  },

  async checkoutGuest(ctx) {
    const body = { ...(ctx.request.body.body || {}), ...ctx.request.body }
    const { summary, cart } = await prepareCheckout(body)
    if (cart.length === 0 || summary.amount < 100) {
      return ctx.send()
    }

    try {
      let intent
      if (body.paymentMethod) {
        intent = await stripe.paymentIntents.create({
          payment_method: body.paymentMethod,
          amount: summary.amount,
          currency: 'gbp',
          confirm: true,
          confirmation_method: 'manual',
        })
      } else if (body.paymentIntent) {
        intent = await stripe.paymentIntents.confirm(body.paymentIntent)
      }

      const response = generateResponse(intent)

      if (response.success) {
        shipOrders({ ...body, cart, paymentIntent: intent })
      }
      return ctx.send({ ...response, body })
    } catch (e) {
      strapi.log.error(e)
      return ctx.send({ error: 'Could not process payment', body })
    }
  },

  async updatePaymentIntent(ctx) {
    const body = ctx.request.body
    const { id } = ctx.params
    const cart = await strapi.plugins['orders'].services.helpers.getValidOrders(
      body.cart
    )
    const summary = await strapi.plugins['orders'].services.price.summary({
      cart,
      couponCode: body.couponCode,
    })

    const paymentIntent = await stripe.paymentIntents.update(id, {
      ...body.data,
      amount: strapi.services.price.toAmount(summary.total),
    })

    ctx.send(paymentIntent)
  },

  async createPaymentIntent(ctx) {
    const body = ctx.request.body
    const cart = await await strapi.plugins[
      'orders'
    ].services.helpers.getValidOrders(body.cart)
    const summary = await strapi.plugins['orders'].services.price.summary({
      cart,
      couponCode: body.couponCode,
    })

    if (summary.total < 1) {
      ctx.send({ error: 'Total too small' })
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: strapi.services.price.toAmount(summary.total),
        currency: 'gbp',
      })
      cart.map((order) => {
        strapi
          .query('order', 'orders')
          .update({ id: order.id }, { paymentIntent: paymentIntent.id })
      })
      ctx.send(paymentIntent)
    }
  },
}
