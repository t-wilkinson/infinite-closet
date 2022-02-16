'use strict'
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { splitName } = require('../../../utils')

/**
 * @typedef {object} Contact
 * @prop {string} firstName
 * @prop {string} lastName
 * @prop {string} email
 */

/**
 * Convert request body to more useful information
 * @returns - {summary, cart, paymentIntent, paymentMethod}
 */
async function prepareData(body, user = null) {
  let error = null
  const cart = await strapi.plugins['orders'].services.cart.createValidCart(
    body.orders
  )

  // Ensure contact has right content
  let contact = body.contact
  if (user) {
    contact = strapi.services.contact.toContact(user)
  } else if (contact && contact.fullName) {
    const name = splitName(contact.fullName)
    contact.firstName = name.firstName || contact.firstName
    contact.lastName = name.lastName || contact.lastName
  }

  const summary = await strapi.plugins['orders'].services.price.summary({
    cart,
    user,
    discountCode: body.discountCode,
  })

  let paymentIntent, paymentMethod
  if (body.paymentIntent) {
    paymentIntent = await stripe.paymentIntents.retrieve(body.paymentIntent)
  }
  if (body.paymentMethod) {
    paymentMethod = await stripe.paymentMethods.retrieve(body.paymentMethod)
  }

  if (cart.length === 0) {
    error = 'Cart is empty or has no valid items to checkout.'
  }

  if (paymentIntent && paymentIntent.amount !== summary.amount) {
    error = 'Payment intent invalid.'
  }

  return {
    error,
    user,
    address: body.address,
    contact,
    summary,
    cart,
    paymentIntent,
    paymentMethod,
  }
}

module.exports = {
  async checkoutUser(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body
    const data = await prepareData(body, user)

    if (data.error) {
      return ctx.badRequest(data.error)
    }

    if (!data.paymentIntent && data.summary.amount < 50) {
      await strapi.plugins['orders'].services.cart.onCheckout(data)
      return ctx.send(null)
    }

    // TODO: create paymentIntent but never confirm it
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
      const checkout = await strapi.plugins['orders'].services.cart.onCheckout({
        ...data,
        paymentIntent,
      })
      ctx.send(checkout)
    } catch (e) {
      strapi.log.error('checkoutUser error', e.stack)
      ctx.badRequest('Payment failed')
    }
  },

  async checkoutGuest(ctx) {
    const body = { ...(ctx.request.body.body || {}), ...ctx.request.body }
    const data = await prepareData(body)

    if (data.error) {
      return ctx.badRequest(data.error)
    }

    if (!data.paymentIntent && data.summary.amount < 50) {
      await strapi.plugins['orders'].services.cart.onCheckout(data)
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
        await strapi.plugins['orders'].services.cart.onCheckout({
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
    const data = await prepareData(body)

    if (data.error) {
      return ctx.badRequest(data.error)
    }

    if (!data.paymentIntent && data.summary.amount < 50) {
      return ctx.send(
        await strapi.plugins['orders'].services.cart.onCheckout(data)
      )
    }

    try {
      return ctx.send(
        await strapi.plugins['orders'].services.cart.onCheckout(data)
      )
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

  async userCheckoutHistory(ctx) {
    const user = ctx.state.user
    let checkouts
    checkouts = await strapi
      .query('checkout')
      .find({ user: user.id }, ['purchase', 'orders'])
    checkouts = await Promise.all(
      checkouts.map(async (checkout) => {
        checkout.orders = await Promise.all(
          checkout.orders.map((order) =>
            strapi.plugins['orders'].services.cart.createCartItem(order)
          )
        )
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            checkout.purchase.paymentIntent
          )
          checkout.purchase.paymentIntent = paymentIntent
        } catch {
          checkout.purchase.paymentIntent = null
        }
        return checkout
      })
    )
    ctx.send(checkouts)
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
