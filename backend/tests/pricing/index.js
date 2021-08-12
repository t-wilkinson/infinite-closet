const couponApi = require('../../plugins/orders/services/Price')
const { mockCoupon } = require('./factory')

describe('Coupon', () => {
  it('should calculate percent off', () => {
    const coupon = mockCoupon({ type: 'percent_off', amount: 10 })
    const discount = couponApi.discount({
      price: 100,
      coupon,
      existingCoupons: [],
    })
    expect(discount.price).toBe(90)
  })

  it('should calculate amount off', () => {
    const coupon = mockCoupon({ type: 'amount_off', amount: 20 })
    const discount = couponApi.discount({
      price: 100,
      coupon,
      existingCoupons: [],
    })
    expect(discount.price).toBe(80)
  })

  it('shouldn\'t max out without existing coupons', () => {
    const coupon = mockCoupon()
    const discount = couponApi.discount({
      price: 100,
      coupon,
      existingCoupons: [],
    })
    expect(discount.valid).toBeTruthy()
  })

  it('should max out with existing coupons', () => {
    const coupon = mockCoupon()
    const discount = couponApi.discount({
      price: 100,
      coupon,
      existingCoupons: [coupon],
    })
    expect(discount.valid).toBeFalsy()
  })
})
