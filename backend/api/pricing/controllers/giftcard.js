'use strict'
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { splitName, day } = require('../../../utils')
const _ = require('lodash')

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
    const { body } = ctx.request
    const paymentIntent = await stripe.paymentIntents.retrieve(
      body.paymentIntent
    )

    try {
      const giftCard = await strapi.services.giftcard.add({
        paymentIntent,
        info: _.pick(body, [
          'senderName',
          'senderEmail',
          'recipientName',
          'recipientEmail',
          'message',
          'deliveryDate',
        ]),
      })

      const { deliveryDate } = body
      const today = day()
      const { firstName } = splitName(body.recipientName)
      if (day(deliveryDate).isSameOrBefore(today, 'day')) {
        strapi.services.template_email.giftCard({
          firstName,
          email: body.recipientEmail,
          giftCard,
        })
      }

      ctx.send(giftCard)
    } catch (e) {
      ctx.badRequest(e.message)
    }
  },

  async getGiftCards(ctx) {
    const { user } = ctx.state
    if (!user) {
      return ctx.send([])
    }

    const giftCards = await strapi
      .query('gift-card')
      .find({ recipientEmail: user.email })
    await Promise.all(
      giftCards.map(async (giftCard) => {
        const purchases = await strapi.services.giftcard.getPurchases(giftCard)
        const value = strapi.services.giftcard.valueLeft(giftCard, purchases)
        giftCard.valueLeft = value
      })
    )
    ctx.send(giftCards)
  },
}
