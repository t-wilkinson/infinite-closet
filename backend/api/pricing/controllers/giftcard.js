'use strict'
const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports = {
  async createPaymentIntent(ctx) {
    const { body } = ctx.request
    const amount = strapi.services.price.toAmount(body.value)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'gbp',
    })
    ctx.send(paymentIntent)
  },

  async updatePaymentIntent(ctx) {
    const { payment_intent_id } = ctx.params
    const { body } = ctx.request
    const amount = strapi.services.price.toAmount(body.value)
    try {
      const paymentIntent = await stripe.paymentIntents.update(
        payment_intent_id,
        {
          amount,
        }
      )
      ctx.send(paymentIntent)
    } catch (e) {
      ctx.badRequest(e.type)
    }
  },

  async purchase(ctx) {
    const { user } = ctx.state
    const { body } = ctx.request
    const paymentIntent = await stripe.paymentIntents.retrieve(
      body.paymentIntent
    )

    try {
      const giftcard = await strapi.services.giftcard.add({
        user,
        paymentIntent,
      })

      ctx.send(giftcard)
    } catch (e) {
      ctx.badRequest(e.message)
    }
  },

  async getGiftCards(ctx) {
    const { user } = ctx.state
    if (!user) {
      return ctx.send([])
    }

    const giftCards = await strapi.query('gift-card').find({ owner: user.id })
    await Promise.all(
      giftCards.map(async (giftCard) => {
        const value = await strapi.services.giftcard.valueLeft(giftCard)
        giftCard.valueLeft = value
      })
    )
    ctx.send(giftCards)
  },
}
