const request = require('supertest')
const { createOrder } = require('./factory')

describe('Cart', () => {
  let order
  beforeAll(async () => {
    order = await createOrder(strapi, {
      startDate: '2021-12-08',
      size: 'MD',
    })
  })

  it('shouldn\'t be available to add to cart when order for that item is already out', async () => {
    const res = await request(strapi.server)
      .post('/orders/dates/valid')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

      .send({
        rentalLength: 'short',
        product: order.product,
        dates: [],
        size: { quantity: 1, size: 'MD' },
      })
      .expect('Content-Type', /json/)

    console.log(res.body)
  })
})
