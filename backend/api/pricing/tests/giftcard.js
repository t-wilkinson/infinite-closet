/**
 * @group lib
 * @group pricing/giftcard
 */
'use strict'
const api = {}
api.giftcard = require('../services/giftcard')

describe('Gift cards', () => {
  it('generates code', () => {
    expect(api.giftcard.generateCode('client secret')).toBeTruthy()
    expect(api.giftcard.generateRandomCode('client secret')).toBeTruthy()
  })

  it.todo('calculates gift card amount left')
})
