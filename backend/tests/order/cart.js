/**
 * @group api
 * @group order
 */
'use strict'
const request = require('supertest')
const {day} = require('../../utils')
const f = {}
f.product = require('../product/factory')
f.order = require('./factory')

describe('Add to cart', () => {
  let product

  beforeAll(async () => {
    product = await f.product.create(strapi, {})
  })

  it('can add product to order', async () => {
    let orderData = f.order.mock({
      startDate: day().add({day: 10}),
    })

    await request(strapi.server)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        ...orderData,
        product: product.id
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        return expect(strapi.query('order', 'orders').findOne({id: res.body.id})).resolves.toBeTruthy()
      })

  })
})
