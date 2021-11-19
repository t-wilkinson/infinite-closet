const priceApi = require('../price')

const defaultData = {
  type: 'amount_off',
  amount: 10,
  code: 'COUPON_CODE',
  maxUses: 1,
  context: 'checkout',
}

const mockCoupon = (data) => ({...defaultData, ...data})

describe('Currency', () => {
  it('Should convert price -> amount', () => {
    expect(priceApi.toAmount(10.0)).toBe(1000)
    expect(priceApi.toAmount('10.0')).toBe(1000)
    expect(priceApi.toAmount(undefined)).toBe(NaN)
  })

  it('Should convert amount -> price', () => {
    expect(priceApi.toPrice(1000)).toBe(10.0)
    expect(priceApi.toPrice('1000')).toBe(10)
    expect(priceApi.toPrice(undefined)).toBe(NaN)
  })
})

describe('Coupon', () => {
  it('should calculate percent off', () => {
    const coupon = mockCoupon({ type: 'percent_off', amount: 10 })
    const discount = priceApi.discount(coupon, 100)
    expect(discount).toBe(10)
  })

  it('should calculate amount off', () => {
    const coupon = mockCoupon({ type: 'amount_off', amount: 20 })
    const discount = priceApi.discount(coupon, 100)
    expect(discount).toBe(20)
  })

  it('shouldn\'t max out without existing coupons', () => {
    const coupon = mockCoupon()
    const valid = priceApi.valid(coupon, [])
    expect(valid).toBeTruthy()
  })

  it('should max out with existing coupons', () => {
    const coupon = mockCoupon()
    const valid = priceApi.valid(coupon, [coupon])
    expect(valid).toBeFalsy()
  })
})

