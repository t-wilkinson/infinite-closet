const request = require('supertest')
const { createOrder } = require('../orders/factory')

describe('Shipping service', () => {
  let order

  beforeAll(async () => {
    order = await createOrder(strapi, {
      startDate: new Date().toJSON(),
    })
  })

  it('ships order', async () => {
    request(strapi.server)
      .post(`/orders/ship/${order.id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        order,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => console.log(res.body))
  })
})
