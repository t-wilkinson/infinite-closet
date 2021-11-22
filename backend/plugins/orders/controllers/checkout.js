'use strict'
const stripe = require('stripe')(process.env.STRIPE_KEY)

/**
 * Convert request body to more useful information
 * @returns - {summary, cart, paymentIntent, paymentMethod}
 */
async function prepareCheckout(body, user = null) {
  const cart = await strapi.plugins['orders'].services.cart.createValidCart(
    body.orders
  )

  const summary = await strapi.plugins['orders'].services.price.summary({
    cart,
    user,
    couponCode: body.couponCode,
  })

  let paymentIntent, paymentMethod
  if (body.paymentIntent) {
    paymentIntent = await stripe.paymentIntents.retrieve(body.paymentIntent)
  }
  if (body.paymentMethod) {
    paymentMethod = await stripe.paymentMethods.retrieve(body.paymentMethod)
  }
  return { summary, cart, paymentIntent, paymentMethod }
}

/**
 * Each cart item has an associated paymentIntent,
 * which we need to check is valid before shipping order.
 */
function validPaymentIntent(cart, paymentIntent) {
  // TODO: what if only some paymentIntents match?
  // Only use paymentIntent created by the server
  // Don't use paymentIntent passed from client
  return (
    cart[0].order.paymentIntent === paymentIntent.id &&
    paymentIntent.status === 'succeeded'
  )
}

module.exports = {
  async checkoutUser(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body
    const { paymentMethod, summary, cart } = await prepareCheckout(body, user)
    if (cart.length === 0 || summary.amount < 100) {
      return ctx.send({}, 404)
    }

    // Charge user and checkout order
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: summary.amount,
        currency: 'gbp',
        customer: user.customer,
        payment_method: paymentMethod.id,
        off_session: false,
        confirm: true,
      })
      await strapi.plugins['orders'].services.helpers.onCheckout({
        ...body,
        summary,
        cart,
        paymentMethod,
        paymentIntent,
      })
      ctx.send({ status: 'success' })
    } catch (e) {
      strapi.log.error('checkoutUser error', e.stack)
      ctx.send({ status: 'error', error: e.message }, 404)
    }
  },

  async checkoutGuest(ctx) {
    const body = { ...(ctx.request.body.body || {}), ...ctx.request.body }
    const { paymentMethod, summary, cart } = await prepareCheckout(body)
    if (cart.length === 0 || summary.amount < 100) {
      return ctx.send({})
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
        await strapi.plugins['orders'].services.helpers.onCheckout({
          ...body,
          summary,
          cart,
          paymentMethod,
          paymentIntent: intent,
        })
      }
      return ctx.send({ ...response, body })
    } catch (e) {
      strapi.log.error('checkoutGuest error', e.stack)
      return ctx.send({ error: 'Could not process payment', body }, 400)
    }
  },

  // Through apple pay
  async checkoutRequest(ctx) {
    const body = ctx.request.body
    const { paymentMethod, paymentIntent, summary, cart } =
      await prepareCheckout(body)
    if (cart.length === 0 || summary.amount < 100) {
      return ctx.send()
    }

    try {
      if (!validPaymentIntent(cart, paymentIntent)) {
        throw new Error('Payment intent invalid')
      }
      await strapi.plugins['orders'].services.helpers.onCheckout({
        ...body,
        summary,
        cart,
        paymentMethod,
        paymentIntent,
      })
      return ctx.send({})
    } catch (e) {
      strapi.log.error('PaymentRequest paymentIntent did not succeed', {
        cart,
        paymentIntent: paymentIntent.id,
        error: e,
      })
      return ctx.send({ error: 'PaymentIntent invalid' }, 400)
    }
  },

  async updatePaymentIntent(ctx) {
    const body = ctx.request.body
    const { id } = ctx.params
    const cart = await strapi.plugins['orders'].services.cart.create(
      body.orders
    )
    const summary = await strapi.plugins['orders'].services.price.summary({
      cart,
      couponCode: body.couponCode,
    })

    const paymentIntent = await stripe.paymentIntents.update(id, {
      ...body.data,
      amount: summary.amount,
    })

    ctx.send(paymentIntent)
  },

  async createPaymentIntent(ctx) {
    const { couponCode, orders } = ctx.request.body
    const cart = await strapi.plugins['orders'].services.cart.create(orders)
    const summary = await strapi.plugins['orders'].services.price.summary({
      cart,
      couponCode,
    })

    if (summary.total < 1) {
      ctx.send({ error: 'Total too small' }, 404)
    } else {
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
    }
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
