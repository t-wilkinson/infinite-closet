/**
 * @group api
 * @group product/price
 */
'use strict'
const f = {}
f.product = require('./factory')
f.price = {
  mock: (opt = {}) => ({
    type: 'amount_off',
    amount: 5,
    context: 'checkout',
    code: 'COUPON_CODE_1',
    maxUses: 1,
    ...opt,
  }),
  create: function (strapi, opt = {}) {
    return strapi.query('coupon').create(this.mock(opt))
  },
}

describe('Price summary', () => {
  let coupon
  beforeAll(async () => {
    coupon = await f.price.create(strapi)
  })

  it('works on basic inputs', async () => {
    const summary = await strapi.services.price.summary({
      code: 'COUPON_CODE_1',
      existingCoupons: [],
      context: 'checkout',
      price: 10,
    })

    expect(summary).toMatchObject({
      discount: 5,
      valid: true,
      coupon,
      subtotal: 10,
      total: 5,
      amount: 500,
    })
  })

  it('doesn\'t apply if coupon is already used', async () => {
    const summary = await strapi.services.price.summary({
      code: 'COUPON_CODE_1',
      existingCoupons: [coupon],
      context: 'checkout',
      price: 10,
    })

    expect(summary).toMatchObject({
      discount: 0,
      valid: false,
      coupon,
      subtotal: 10,
      total: 10,
      amount: 1000,
    })
  })
})
