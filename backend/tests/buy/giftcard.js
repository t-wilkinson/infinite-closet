/**
 * @group api
 * @group buy
 * @group buy/giftcard
 */
'use strict'
const { jsonRequest, grantPrivileges } = require('../helpers/strapi')
// const request = require('supertest')
// const { day } = require('../../utils')
// const stripe = require('stripe')(process.env.STRIPE_KEY)

describe('Gift card', () => {
  beforeAll(async () => {
    await grantPrivileges(2, [
      'permissions.application.controllers.giftcard.createPaymentIntent',
      'permissions.application.controllers.giftcard.purchase',
    ])
  })

  it.skip('works', async () => {
    const amount = 10
    try {
      const paymentIntent = await jsonRequest('/giftcards/payment-intent', {
        body: { amount },
      }).then((res) => res.body)
      console.log(paymentIntent)

      const giftcard = await jsonRequest('/giftcards', {
        body: {
          amount,
          paymentIntent: paymentIntent.id,
        },
      }).then((res) => res.body)

      console.log(giftcard)
    } catch (e) {
      console.log(e)
    }
  })
})
