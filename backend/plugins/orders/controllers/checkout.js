'use strict'
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { toId, toFullName, splitName } = require('../../../utils')

/**
 * @typedef {object} Contact
 * @prop {string} firstName
 * @prop {string} lastName
 * @prop {string} email
 */

/**
 * Core function used by all checkout methods which handles necessary checkout functions
 * On checkout, we need to:
 *  - Validate address
 *  - Update information about orders (change status, etc.)
 *  - Send an email to the client
 *  - Ship order
 *  - etc.
 */
async function onCheckout({
  user,
  contact,
  address,
  cart,
  summary,
  paymentIntent,
  paymentMethod,
}) {
  // Create/update address
  const addressParams = {
    email: contact.email,
    fullName: toFullName(contact),
  }
  switch (typeof address) {
    case 'object':
      address = await strapi
        .query('address')
        .create({ ...addressParams, ...address })
      break
    case 'string':
    case 'number':
      address = await strapi
        .query('address')
        .update({ id: address }, addressParams)
      break
  }

  // Validate address
  const isAddressValid = await strapi.services.shipment.validateAddress(address)
  if (!isAddressValid && process.env.NODE_ENV === 'production') {
    throw new Error('Expected a valid address.')
  }

  // Contact
  contact = await strapi.services.contact.upsertContact(contact)

  // Purchase
  const purchase = await strapi.query('purchase').create({
    paymentIntent: paymentIntent?.id,
    paymentMethod: paymentMethod?.id,
    charge: summary.total,
    coupon: summary.coupon?.id,
    giftCard: summary.giftCard?.id,
    giftCardDiscount: summary.giftCardDiscount,
    contact: contact?.id,
  })

  // Checkout
  const orderIds = strapi.plugins['orders'].services.cart
    .orders(cart)
    .map((order) => toId(order.id))
  const checkout = await strapi.query('checkout').create({
    orders: orderIds,
    address: address.id,
    purchase: purchase.id,
    user: user?.id,
    contact: contact?.id,
  })

  // Forward lifecycle of each order
  const settled = await Promise.allSettled(
    cart.map(async (cartItem) => {
      strapi.plugins['orders'].services.lifecycle.on(
        'confirmed',
        cartItem.order,
        {
          user,
          contact,
          address,
        }
      )
    })
  )

  // Error handling
  const failed = settled
    .filter((res) => res.status === 'rejected')
    .map((res) => res.reason)
  if (failed.length > 0) {
    strapi.log.error('Failed to prepare cart for shipping', failed)
  }

  strapi.services.template_email.orderConfirmation({
    contact,
    summary,
    cart,
    address,
  })

  return checkout
}

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
      await onCheckout(data)
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
      await onCheckout({
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
    const data = await prepareData(body)

    if (data.error) {
      return ctx.badRequest(data.error)
    }

    if (!data.paymentIntent && data.summary.amount < 50) {
      await onCheckout(data)
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
        await onCheckout({
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
      await onCheckout(data)
      return ctx.send(null)
    }

    try {
      await onCheckout(data)
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
