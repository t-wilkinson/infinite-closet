/**
 * @group api
 * @group buy
 * @group buy/summary
 */
'use strict'
// const { jsonRequest, grantPrivileges } = require('../helpers/strapi')
// const request = require('supertest')
// const { day } = require('../../utils')
// const stripe = require('stripe')(process.env.STRIPE_KEY)

const GIFT_CARD_CODE_LENGTH = 6

describe('Summary', () => {
  beforeAll(async () => {
    // await grantPrivileges(2, [
    // ])
  })

  it('works', async () => {
    const value = 10
    const giftCard = await strapi.services.giftcard.create({ value })
    const summary = await strapi.services.price.summary({
      price: giftCard.value,
      context: 'checkout',
      giftCardCode: giftCard.code.slice(0, GIFT_CARD_CODE_LENGTH),
      existingCoupons: [],
    })
    expect(summary).toBeTruthy()
  })
})
