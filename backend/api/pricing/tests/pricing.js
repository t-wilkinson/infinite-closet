/**
 * @group lib
 * @group pricing
 */
'use strict'
let api = {}
api.price = require('../services/price')
let mock = {}
mock.coupon = require('./coupon').mockCoupon
mock.giftCard = require('./giftcard').mockGiftCard

describe('Currency', () => {
  it('Should convert price -> amount', () => {
    expect(api.price.toAmount(10.0)).toBe(1000)
    expect(api.price.toAmount('10.0')).toBe(1000)
    expect(api.price.toAmount(undefined)).toBe(NaN)
  })

  it('Should convert amount -> price', () => {
    expect(api.price.toPrice(1000)).toBe(10.0)
    expect(api.price.toPrice('1000')).toBe(10)
    expect(api.price.toPrice(undefined)).toBe(NaN)
  })
})

const mockDiscount = ({coupon, giftCard, ...props}={}) => {
  return {
    price: 100,
    outOfStockTotal: 0,

    coupon: mock.coupon(coupon),
    existingCoupons: [],

    giftCard: mock.giftCard(giftCard),
    giftCardPurchases: [],
    giftCardPaymentIntent: undefined,

    ...props,
  }
}

describe('Discount', () => {
  it('works', () => {
    const discount = mockDiscount({})
    expect(api.price.discount(discount)).toBeTruthy()
  })

  it('isn\'t greater than total price', () => {
    const discount = mockDiscount({
      price: 10,
      coupon: { amount: 7 },
      giftCard: { value: 7 },
    })
    expect(api.price.discount(discount)).toMatchObject({
      discountPrice: 10,
    })
  })

  it('uses up coupon first', () => {
    const discount = mockDiscount({
      price: 10,
      coupon: { amount: 20 },
      giftCard: { value: 20 },
    })
    expect(api.price.discount(discount)).toMatchObject({
      discountPrice: 10,
      couponDiscount: 10,
      giftCardDiscount: 0,
    })
  })

  it('isn\'t greater than total price', () => {
    const discount = mockDiscount({
      price: 10,
      coupon: { amount: 20 },
      giftCard: { value: 20 },
    })
    expect(api.price.discount(discount)).toMatchObject({
      discountPrice: 10,
      couponDiscount: 10,
      giftCardDiscount: 0,
    })
  })
})
