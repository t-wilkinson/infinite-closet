'use strict'
const stripe = require('stripe')(process.env.STRIPE_KEY)
const unparsed = Symbol.for('unparsedBody')
const endpointSecret = 'whsec_c5b70d11f6d6208d337fb4e089506ce3e339641728ca7a7ed4fbc9710d886bd6'

module.exports = {
  async paymentMethods(ctx) {
    const user = ctx.state.user
    let paymentMethods = []
    do {
      // fetch all payment methods attached to user
      const res = await stripe.paymentMethods.list({
        customer: user.customer,
        type: 'card',
      })
      paymentMethods = paymentMethods.concat(res.data)
    } while (paymentMethods.has_more)

    ctx.send({
      paymentMethods,
    })
  },

  async attachSetupIntent(ctx) {
    const user = ctx.state.user
    const intent = await stripe.setupIntents.create({
      customer: user.customer,
    })

    ctx.send({
      clientSecret: intent.client_secret,
    })
  },

  async detachPaymentMethods(ctx) {
    const { id } = ctx.params
    const paymentMethod = await stripe.paymentMethods.detach(id)
    ctx.send({
      paymentMethod,
    })
  },

  async webhook(ctx) {
    const unparsedBody = ctx.request.body[unparsed]
    const sig = ctx.request.header['stripe-signature']
    let event

    try {
      event = stripe.webhooks.constructEvent(unparsedBody, sig, endpointSecret)
    } catch (err) {
      strapi.log.error(err)
      return ctx.badRequest(`Webhook Error: ${err.message}`)
    }

    // console.log(event)
    // const object = event.data?.object
    // console.log(event.type)
    switch (event.type) {
      case 'payment_intent.succeeded':
        // strapi.services.template_email.purchaseSuccess({
        //   email
        // })
        // object.metadata.context
        break
      case 'payment_intent.processing':
        break
      case 'payment_intent.payment_failed':
        // Send payment failure
        break
    }
    ctx.send(null)
  },
}
