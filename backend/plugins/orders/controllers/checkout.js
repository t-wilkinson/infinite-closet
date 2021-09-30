'use strict'
const stripe = require('stripe')(process.env.STRIPE_KEY)

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

async function shipCart({
  contact,
  address,
  cart,
  summary,
  paymentIntent,
  paymentMethod,
}) {
  if (typeof address === 'object') {
    address = await strapi
      .query('address')
      .create(address)
      .then((res) => res.id)
  }

  let orders = await Promise.allSettled(
    strapi.plugins['orders'].services.cart.orders(cart).map((order) =>
      strapi.query('order', 'orders').update(
        { id: order.id },
        {
          address,
          paymentIntent: paymentIntent ? paymentIntent.id : paymentIntent || '',
          paymentMethod: paymentMethod ? paymentMethod.id : paymentMethod || '',
          status: 'planning',
          coupon: summary.coupon.id,
          range: strapi.services.timing.range(order),
          price: strapi.plugins['orders'].services.price.orderTotal(order),
        }
      )
    )
  )
  strapi.log.info('%o', orders)
  orders = orders.filter((v) => v.status === 'fulfilled').map((v) => v.value)

  if (contact) {
    return strapi.plugins['email'].services.email.send({
      template: 'checkout',
      to: contact.email,
      cc:
        process.env.NODE_ENV === 'production'
          ? 'ukinfinitecloset@gmail.com'
          : '',
      bcc: 'infinitecloset.co.uk+6c3ff2e3e1@invite.trustpilot.com',
      subject: 'Thank you for your order',
      data: {
        name: contact.fullName,
        firstName: contact.nickName,
        orders,
        totalPrice: summary.total,
      },
    })
  }
  return { status: 'success' }
}

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
    const { paymentMethod, paymentIntent, summary, cart } =
      await prepareCheckout(body, user)
    if (cart.length === 0 || summary.amount < 100) {
      return ctx.send()
    }

    try {
      if (validPaymentIntent(cart, paymentIntent)) {
        await shipCart({
          ...body,
          summary,
          cart,
          paymentMethod,
          paymentIntent,
        })
        return ctx.send()
      } else {
        await stripe.paymentIntents
          .create({
            amount: summary.amount,
            currency: 'gbp',
            customer: user.customer,
            payment_method: body.paymentMethod,
            off_session: false,
            confirm: true,
          })
          .then((paymentIntent) =>
            shipCart({
              ...body,
              summary,
              cart,
              paymentMethod,
              paymentIntent,
            })
          )
        return ctx.send()
      }
    } catch (e) {
      strapi.log.error('checkoutUser %o', e)
    }
  },

  async checkoutRequestGuest(ctx) {
    const body = ctx.request.body
    const { paymentMethod, paymentIntent, summary, cart } =
      await prepareCheckout(body)
    if (cart.length === 0 || summary.amount < 100) {
      return ctx.send()
    }

    if (validPaymentIntent(cart, paymentIntent)) {
      try {
        await shipCart({
          ...body,
          summary,
          cart,
          paymentMethod,
          paymentIntent,
        })
        return ctx.send()
      } catch (e) {
        strapi.log.error('PaymentRequest paymentIntent did not succeed %o', {
          orders: cart.map((order) => order.id),
          paymentIntent,
          error: e,
        })
        return ctx.send({ error: 'PaymentIntent invalid' }, 400)
      }
    } else {
      strapi.log.error('PaymentRequest paymentIntent did not succeed %o', {
        orders: cart.map((order) => order.id),
        paymentIntent,
      })
      return ctx.send({ error: 'PaymentIntent invalid' }, 400)
    }
  },

  async checkoutGuest(ctx) {
    const body = { ...(ctx.request.body.body || {}), ...ctx.request.body }
    const { paymentMethod, summary, cart } = await prepareCheckout(body)
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
        await shipCart({
          ...body,
          summary,
          cart,
          paymentMethod,
          paymentIntent: intent,
        })
      }
      return ctx.send({ ...response, body })
    } catch (e) {
      strapi.log.error(e)
      return ctx.send({ error: 'Could not process payment', body }, 400)
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
      ctx.send({ error: 'Total too small' })
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
