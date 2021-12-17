/**
 * @group lib
 * @group pricing/giftcard
 */
'use strict'
const api = {}
api.giftcard = require('../giftcard')

describe('Gift cards', () => {
  it('generates code', () => {
    const code = api.giftcard.generateCode('client secret')
    expect(code).toBeTruthy()
  })

  it.todo('calculates gift card amount left')
})
