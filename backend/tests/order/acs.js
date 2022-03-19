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

describe.skip('Verifies postcodes', () => {
  it('Verifies hived address', async () => {
    const valid = api.verify('EC2A 3QF')
    expect(valid).toBe(true)
  })

  it('Fails on wrong address', async () => {
    const valid = api.verify('invalid address')
    expect(valid).toBe(false)
  })
})

describe('Shipping', () => {
  it.skip('works', async () => {
    const order = await f.order.create(strapi)
    const cartItem = await strapi.plugins['orders'].services.cart.createCartItem(order)
    const shippingData = await strapi.plugins['orders'].services.ship.prepareToShip(cartItem)
    const shippingRequest = {
      collection: 'infinitecloset',
      recipient: shippingData.address,
      rental: shippingData.rental,
    }
    const res = await api.ship(shippingRequest)
    console.log(res)
  })

  it('get order tracking', async () => {
    await api.status(203)
    // JC026921770GB
  })
})
