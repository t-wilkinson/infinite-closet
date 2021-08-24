const couponApi = require('../../api/pricing/services/coupon')
const { mockCoupon } = require('./factory')

describe('Coupon', () => {
  it('should calculate percent off', () => {
    const coupon = mockCoupon({ type: 'percent_off', amount: 10 })
    const discount = couponApi.discount({
      coupon,
      price: 100,
    })
    expect(discount).toBe(90)
  })

  it('should calculate amount off', () => {
    const coupon = mockCoupon({ type: 'amount_off', amount: 20 })
    const discount = couponApi.discount({
      price: 100,
      coupon,
    })
    expect(discount).toBe(80)
  })

  it('shouldn\'t max out without existing coupons', () => {
    const coupon = mockCoupon()
    const valid = couponApi.valid({
      coupon,
      existingCoupons: [],
    })
    expect(valid).toBeTruthy()
  })

  it('should max out with existing coupons', () => {
    const coupon = mockCoupon()
    const valid = couponApi.valid({
      coupon,
      existingCoupons: [coupon],
    })
    expect(valid).toBeFalsy()
  })
})
