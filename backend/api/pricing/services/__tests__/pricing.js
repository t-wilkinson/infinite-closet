/**
 * @group lib
 * @group pricing
 */
'use strict'
const priceApi = require('../price')

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
