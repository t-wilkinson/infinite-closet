/**
 * @group api
 * @group order
 * @group order/price
 */
'use strict'

// const request = require('supertest')
// const { day } = require('../../utils')
// const stripe = require('stripe')(process.env.STRIPE_KEY)
// const { grantPrivileges } = require('../helpers/strapi')
const f = {}
f.product = require('../product/factory')
f.order = require('./factory')
f.user = require('../user/factory')
f.designer = require('../product/designer-factory')
f.cart = require('./cart/factory')

describe.skip('Order pricing', () => {
  let user
  beforeAll(async () => {
    user = await f.user.create(strapi)
  })

  it('summary', async () => {
    let cart = await f.cart.create(strapi, [{}])
    const summary = await strapi.plugins['orders'].services.price.summary({cart, user})
    strapi.services.timing.logRange(cart[0].range)
  })
})
