/**
 * @group lib
 * @group pricing/coupon
 */
'use strict'
const couponApi = require('../services/coupon')
const { day } = require('../../../utils')

const defaultData = {
  type: 'amount_off',
  amount: 10,
  code: 'COUPON_CODE',
  maxUses: 1,
  context: 'checkout',
  minActivePrice: 0,
  restrictToStock: false,
}

const mockCoupon = (data) => ({ ...defaultData, ...data })

describe('Coupon', () => {
  it('should calculate percent off', () => {
    const coupon = mockCoupon({ type: 'percent_off', amount: 10 })
    const discount = couponApi.discount({ price: 100, coupon })
    expect(discount).toBe(10)
  })

  it('should calculate amount off', () => {
    const coupon = mockCoupon({ type: 'amount_off', amount: 20 })
    const discount = couponApi.discount({ price: 100, coupon })
    expect(discount).toBe(20)
  })

  it('should restrict to stock', () => {
    const coupon = mockCoupon({ restrictToStock: true, type: 'percent_off', amount: 10 })
    const discount = couponApi.discount({ price: 200, coupon, outOfStockTotal: 100 })
    expect(discount).toBe(10)
  })

  it('should work with a minimum active price', () => {
    const coupon = mockCoupon({ minActivePrice: 50, type: 'amount_off', amount: 10 })
    let discount
    discount = couponApi.discount({ price: 50, coupon })
    expect(discount).toBe(10)

    discount = couponApi.discount({ price: 49, coupon })
    expect(discount).toBe(0)
  })

  it("shouldn't max out without existing coupons", () => {
    const coupon = mockCoupon()
    const valid = couponApi.valid(coupon, [])
    expect(valid).toBeTruthy()
  })

  it('should max out with existing coupons', () => {
    const coupon = mockCoupon()
    const valid = couponApi.valid(coupon, [coupon])
    expect(valid).toBeFalsy()
  })

  it('should expire day after expiration date', () => {
    const coupon = mockCoupon({
      expiration: day().subtract({ days: 1 }),
    })
    const valid = couponApi.valid(coupon, [])
    expect(valid).toBeFalsy()
  })

  it("shouldn't expire before expiration date", () => {
    const coupon = mockCoupon({
      expiration: day({ day: 1 }),
    })
    const valid = couponApi.valid(coupon, [])
    expect(valid).toBeFalsy()
  })
})

module.exports = {
  mockCoupon,
}
