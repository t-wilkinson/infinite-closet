/**
 * @group lib
 * @group pricing/giftcard
 */
'use strict'
const api = {}
const mock = {}
api.giftCard = require('../services/giftcard')

mock.giftCard = (options) => ({
  value: 100,
  ...options
})
mock.purchases = (...amounts) => amounts.map(amount => ({
  giftCardDiscount: amount,
}))

describe('Gift cards', () => {
  const clientSecret = '<client_secret>'
  it('works', () => {
    expect(api.giftCard.generateRandomCode(clientSecret)).toBeTruthy()
  })

  it('is random', () => {
    const c1 = api.giftCard.generateRandomCode(clientSecret)
    const c2 = api.giftCard.generateRandomCode(clientSecret)
    expect(c1).not.toEqual(c2)
  })

  it('substracts purchase amounts', () => {
    const giftCard = mock.giftCard({ value: 100 })

    expect(api.giftCard.valueLeft(giftCard, mock.purchases(10))).toEqual(90)
    expect(api.giftCard.valueLeft(giftCard, mock.purchases(110))).toEqual(0)
  })

  it('calculates discount', () => {
    const giftCard = mock.giftCard({ value: 100 })
    expect(api.giftCard.discount(50, giftCard, mock.purchases(10))).toBe(50)
    expect(api.giftCard.discount(50, giftCard, mock.purchases(90))).toBe(10)
    expect(api.giftCard.discount(50, giftCard, mock.purchases(50, 50, 50))).toBe(0)
  })
})

module.exports = {
  mockGiftCard: mock.giftCard,
}
