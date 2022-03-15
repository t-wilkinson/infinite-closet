/**
 * @group api
 * @group shipping/acs
 */
'use strict'
const api = require('../../api/shipping/services/acs/api')
const f = {}
f.product = require('../product/factory')
f.order = require('./factory')
f.user = require('../user/factory')
f.designer = require('../product/designer-factory')
f.cart = require('./cart/factory')

describe('Verifies postcodes', () => {
  it('Verifies hived address', async () => {
    const valid = api.verify('EC2A 3QF')
    expect(valid).toBe(true)
  })

  it('Fails on wrong address', async () => {
    const valid = api.verify('****')
    expect(valid).toBe(false)
  })
})

// describe('Shipping', () => {
//   it('works', async () => {
//     const order =
//     const shippingData =
//     const data = await prepareToShip(cartItem)
//     const shippingRequest = {
//       collection: 'infinitecloset',
//       recipient: data.address,
//       rental: data.rental,
//     }
//     api.ship()
//   })
// })
