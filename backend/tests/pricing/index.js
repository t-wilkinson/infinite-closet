const couponApi = require('../../api/pricing/services/price')
const { mockCoupon } = require('./factory')

describe('Coupon', () => {
  it('should calculate percent off', () => {
    const coupon = mockCoupon({ type: 'percent_off', amount: 10 })
    const discount = couponApi.discount(coupon, 100)
    expect(discount).toBe(10)
  })

  it('should calculate amount off', () => {
    const coupon = mockCoupon({ type: 'amount_off', amount: 20 })
    const discount = couponApi.discount(coupon, 100)
    expect(discount).toBe(20)
  })

  it('shouldn\'t max out without existing coupons', () => {
    const coupon = mockCoupon()
    const valid = couponApi.valid(coupon, [])
    expect(valid).toBeTruthy()
  })

  it('should max out with existing coupons', () => {
    const coupon = mockCoupon()
    const valid = couponApi.valid(coupon, [coupon])
    expect(valid).toBeFalsy()
  })
})
