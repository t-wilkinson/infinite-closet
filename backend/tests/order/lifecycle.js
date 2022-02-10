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
const statusChangesToday = (status) => {
  const expectedStart = day().toJSON()
  const range = strapi.services.timing.range({
    rentalLength: 'short',
    expectedStart,
    shipment: {
      completed: day().toJSON(),
    },
  })
  const diff = range[status]?.diff(expectedStart, 'day')
  const changeDate = day(expectedStart).subtract(diff, 'day').toJSON()
  return changeDate
}

describe('Confirmed', () => {
  let lifecycle
  let orders
  // let data
  // let contact
  // let address
  let statuses

  beforeAll(async () => {
    statuses = strapi.models.shipment.attributes.status.enum
    // contact = {
    //   firstName: 'first',
    //   lastName: 'last',
    //   email: 'info+test@infinitecloset.co.uk',
    // }
    // address = {
    //   addressLine1: 'Address line 1',
    //   town: 'town',
    //   postcode: 'postcode',
    //   email: 'email',
    // }

    lifecycle = strapi.plugins['orders'].services.lifecycle
    orders = await Promise.all(
      ['confirmed', 'shipped', 'start', 'end', 'cleaning', 'completed'].map(
        (status) => {
          const nextStatus = statuses[statuses.indexOf(status) + 1]
          const expectedStart = statusChangesToday(nextStatus)
          const data = {
            status: 'shipping',
            expectedStart,
            shipment: {
              status,
            },
          }
          return f.order.create(strapi, data)
        }
      )
    )
  })

  test('works', async () => {
    orders = await lifecycle.forwardAll()
    orders = await strapi
      .query('order', 'orders')
      .find({ id_in: orders.all.map((order) => order.id) }, ['shipment'])
    // console.log(orders.map((order) => order.shipment.status))
    // console.log(orders)
    // console.log(JSON.stringify(orders, null, 4))
    // const checkout = await strapi.plugins['orders'].['confirmed'](data)
    // expect(data.error).toBeFalsey()
    // expect(checkout.purchase.status).toBe('success')
    // expect(checkout.contact).toMatchObject(contact)
    // expect(checkout.address).toMatchObject(address)
    // expect(checkout.orders.map((order) => order.id)).toEqual(
    //   orders.map((order) => order.id)
    // )
  })
})
