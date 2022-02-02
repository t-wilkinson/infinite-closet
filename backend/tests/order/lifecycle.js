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
const statusChangesToday = (startDate, status) => {
  const today = day()
  const range = strapi.services.timing.range({
    rentalLength: 'short',
    startDate: today.toJSON(),
  })
  const diff = range[status].date() - day(startDate).date()
  startDate = range[status].subtract(diff, 'date')
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

    orders = await Promise.all(
      [
        {
          status: 'planning',
          startDate: statusChangesToday(),
        },
      ].map((orderData) => f.order.create(strapi, orderData))
    )
  })

  it('works', async () => {
    lifecycle.forwardAll()
  })

  test('shipped', async () => {
    // lifecycle.on['shipped']()
  })
})

describe.only('Confirmed', () => {
  let lifecycle
  let orders
  let data
  let contact
  let address

  beforeAll(async () => {
    contact = {
      firstName: 'first',
      lastName: 'last',
      email: 'info+test@infinitecloset.co.uk',
    }
    address = {
      addressLine1: 'Address line 1',
      town: 'town',
      postcode: 'postcode',
      email: 'email',
    }

    lifecycle = strapi.plugins['orders'].services.lifecycle
    orders = await Promise.all(
      [
        {
          rentalLength: 'short',
          startDate: day().add(21, 'day').toJSON(),
        },
      ].map((orderData) => f.order.create(strapi, orderData))
    )
    data = await strapi.plugins['orders'].services.checkout.prepareData({
      orders,
      contact,
      address,
    })
  })

  test('works', async () => {
    const checkout = await lifecycle.on['confirmed'](data)
    expect(data.error).toBeFalsey()
    expect(checkout.purchase.status).toBe('success')
    expect(checkout.contact).toMatchObject(contact)
    expect(checkout.address).toMatchObject(address)
    expect(checkout.orders.map((order) => order.id)).toEqual(
      orders.map((order) => order.id)
    )
  })
})
