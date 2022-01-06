/**
 * @group api
 * @group order
 * @group order/lifecycle
 */

'use strict'
// const request = require('supertest')
const { day } = require('../../utils')
// const stripe = require('stripe')(process.env.STRIPE_KEY)
// const { grantPrivileges } = require('../helpers/strapi')
const f = {}
f.product = require('../product/factory')
f.order = require('./factory')
f.user = require('../user/factory')
f.designer = require('../product/designer-factory')

// TODO: does this work?
const statusChangesToday = (order, status) => {
  const today = day()
  const range = strapi.services.timing.range({rentalLength: 4, startDate: today})
  const diff = range[status].date() - day(order.startDate).date()
  const startDate = range[status].subtract(diff, 'date')
  return startDate.toJSON()
}

describe('Lifecycle', () => {
  let orders
  let today
  let on
  let lifecycle

  beforeAll(async () => {
    lifecycle = strapi.plugins['orders'].services.lifecycle
    today = day()

    orders = await Promise.all([
      {
        status: 'planning',
        startDate: statusChangesToday()
      }
    ].map(orderData => f.order.create(strapi, orderData)))
  })

  it('works', async () => {
    lifecycle.forwardAll()
  })

  test('shipped', async () => {
    // lifecycle.on['shipped']()
  })
})
