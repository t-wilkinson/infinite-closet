'use strict'
const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports = {
  async checkoutUser(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body
    const data = await strapi.plugins[
      'orders'
    ].services.checkout.prepareData(body, user)

    if (data.error) {
      return ctx.badRequest(data.error)
    }

    if (!data.paymentIntent && data.summary.amount < 50) {
      await strapi.plugins['orders'].services.checkout.onCheckout(data)
      return ctx.send(null)
    }

    // Charge user and checkout order
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.summary.amount,
        currency: 'gbp',
        customer: user.customer,
        payment_method: data.paymentMethod.id,
        off_session: false,
        confirm: true,
      })
      await strapi.plugins['orders'].services.checkout.onCheckout({
        ...data,
        paymentIntent,
      })
      ctx.send(null)
    } catch (e) {
      strapi.log.error('checkoutUser error', e.stack)
      ctx.badRequest('Payment failed')
    }
  },

  async checkoutGuest(ctx) {
    const body = { ...(ctx.request.body.body || {}), ...ctx.request.body }
    const data = await strapi.plugins[
      'orders'
    ].services.checkout.prepareData(body)

    if (data.error) {
      return ctx.badRequest(data.error)
    }

    if (!data.paymentIntent && data.summary.amount < 50) {
      await strapi.plugins['orders'].services.checkout.onCheckout(data)
      return ctx.send({ status: 'no-charge' })
    }

    try {
      let intent
      if (body.paymentMethod) {
        intent = await stripe.paymentIntents.create({
          payment_method: body.paymentMethod,
          amount: data.summary.amount,
          currency: 'gbp',
          confirm: true,
          confirmation_method: 'manual',
        })
      } else if (body.paymentIntent) {
        intent = await stripe.paymentIntents.confirm(body.paymentIntent)
      }

      const response = generateResponse(intent)

      if (response.success) {
        await strapi.plugins['orders'].services.checkout.onCheckout({
          ...data,
          paymentIntent: intent,
        })
      }
      return ctx.send({ ...response, body })
    } catch (e) {
      strapi.log.error('checkoutGuest error', e.stack)
      return ctx.badRequest({ error: 'Could not process payment', body })
    }
  },

  // Through apple pay
  async checkoutRequest(ctx) {
    const body = ctx.request.body
    const data = await strapi.plugins[
      'orders'
    ].services.checkout.prepareData(body)

    if (data.error) {
      return ctx.badRequest(data.error)
    }

    if (!data.paymentIntent && data.summary.amount < 50) {
      await strapi.plugins['orders'].services.checkout.onCheckout(data)
      return ctx.send(null)
    }

    try {
      await strapi.plugins['orders'].services.checkout.onCheckout(data)
      return ctx.send(null)
    } catch (e) {
      strapi.log.error('PaymentRequest paymentIntent did not succeed', {
        cart: data.cart,
        paymentIntent: data.paymentIntent.id,
        error: e,
      })
      return ctx.send({ error: 'PaymentIntent invalid' }, 400)
    }
  },

  async updatePaymentIntent(ctx) {
    const { user } = ctx.state
    const body = ctx.request.body
    const { id } = ctx.params
    const cart = await strapi.plugins['orders'].services.cart.create(
      body.orders
    )
    const summary = await strapi.plugins['orders'].services.price.summary({
      user,
      cart,
      discountCode: body.discountCode,
    })

    if (summary.total < 1) {
      return ctx.send(null)
    }

    const paymentIntent = await stripe.paymentIntents.update(id, {
      ...body.data,
      amount: summary.amount,
    })

    ctx.send(paymentIntent)
  },

  async createPaymentIntent(ctx) {
    const { user } = ctx.state
    const { discountCode, orders } = ctx.request.body
    const cart = await strapi.plugins['orders'].services.cart.create(orders)
    const summary = await strapi.plugins['orders'].services.price.summary({
      user,
      cart,
      discountCode,
    })

    if (summary.amount < 50) {
      return ctx.send(null)
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: summary.amount,
      currency: 'gbp',
    })
    orders.map((order) =>
      strapi
        .query('order', 'orders')
        .update({ id: order.id }, { paymentIntent: paymentIntent.id })
    )
    ctx.send(paymentIntent)
  },
}

function generateResponse(intent) {
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
