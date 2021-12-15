'use strict'

const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports = {
  async purchase(ctx) {
    const { user } = ctx.state
    const { body } = ctx.request

    const giftCard = strapi.services.giftcard.generate({
      amount: body.amount,
      user,
    })

    ctx.send(null)
  },
}
