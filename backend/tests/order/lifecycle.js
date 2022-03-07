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

describe('Lifecycle', () => {
  let lifecycle
  let orders
  let statuses

  beforeAll(async () => {
    statuses = strapi.models.shipment.attributes.status.enum
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

  it('forwards orders', async () => {
    // async function forwardOrder(nextStatus, orderData) {
    //   const order = await f.order.create(strapi, orderData)
    //   await lifecycle.forwardOrder(order, nextStatus)
    // }
    // forwardOrder('', {})

    const forwardedOrders = await lifecycle.forwardAll()
    orders = await strapi
      .query('order', 'orders')
      .find({ id_in: forwardedOrders.all.map((order) => order.id) }, ['shipment'])
    console.log(orders)
  })
})

describe('Forward order status', () => {
  let lifecycle

  beforeAll(async () => {
    lifecycle = strapi.plugins['orders'].services.lifecycle
  })

  it('forwards order status', async () => {
    let order = await f.order.create(strapi, { status:  null })

    order = await lifecycle.forwardOrderStatus('shipped', order)
    expect(order.status).toBe('shipping')
    expect(order.shipment.status).toBe('shipped')

    order = await lifecycle.forwardOrderStatus('start', order)
    expect(order.status).toBe('shipping')
    expect(order.shipment.status).toBe('start')

    order = await lifecycle.forwardOrderStatus('end', order)
    expect(order.status).toBe('shipping')
    expect(order.shipment.status).toBe('end')

    order = await lifecycle.forwardOrderStatus('cleaning', order)
    expect(order.status).toBe('shipping')
    expect(order.shipment.status).toBe('cleaning')

    order = await lifecycle.forwardOrderStatus('completed', order)
    expect(order.status).toBe('completed')
    expect(order.shipment.status).toBe('completed')

    console.log(order)
  })
})

