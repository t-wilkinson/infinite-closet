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
  })

  it('works', async () => {
    const value = 10
    const giftCard = await strapi.services.giftcard.create({value})
    const summary = await strapi.services.price.summary({
      price: 10,
      value: giftCard.value,
      giftCardCode: giftCard.code.slice(0, GIFT_CARD_CODE_LENGTH),
    })
    expect(summary).objectContaining({
      valid: true,
      discount: value,
      giftCard,
      total: 0,
    })
  })

  // it('shouldn\'t accept codes less than gift_card_code_length', async () => {
  //   const value = 10
  //   const giftCard = await strapi.services.giftcard.create({value})
  //   const summary = await strapi.services.price.summary({
  //     value: giftCard.value,
  //     giftCardCode: giftCard.code.slice(0, GIFT_CARD_CODE_LENGTH - 1),
  //   })
  //   expect(summary).toBeFalsey()
  // })
})
