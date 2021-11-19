const fs = require('fs')
const { setupStrapi } = require('./helpers/strapi')

describe.skip('Strapi', () => {
  jest.setTimeout(30000)

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

  /** this code is called once before any test is called */
  beforeAll(async () => {
    await setupStrapi() // singleton so it can be called many times
  })

  /** this code is called once before all the tested are finished */
  afterAll(async () => {
    await strapi.server.close()
    await sleep(1000) // clear database connection
    const dbSettings = strapi.config.get('database.connections.default.settings')
    //delete test database after all tests
    if (dbSettings && dbSettings.filename) {
      const tmpDbFile = `${__dirname}/../${dbSettings.filename}`
      if (fs.existsSync(tmpDbFile)) {
        fs.unlinkSync(tmpDbFile)
      }
    }
    await new Promise((resolve) => setTimeout(() => resolve(), 500)) // avoid jest open handle error
  })

  describe('Strapi', () => {
    it('is defined', async () => {
      await expect(strapi).toBeDefined()
    })
  })

  // describe('', () => {
  //   const request = require('supertest')
  //   const { createOrder } = require('./factory')

  //   describe('Cart', () => {
  //     let order
  //     beforeAll(async () => {
  //       order = await createOrder(strapi, {
  //         startDate: '2021-12-08',
  //         size: 'MD',
  //       })
  //     })

  //     it('shouldn\'t be available to add to cart when order for that item is already out', async () => {
  //       await request(strapi.server)
  //         .post('/orders/dates/valid')
  //         .set('Accept', 'application/json')
  //         .set('Content-Type', 'application/json')

  //         .send({
  //           rentalLength: 'short',
  //           product: order.product,
  //           dates: [],
  //           size: { quantity: 1, size: 'MD' },
  //         })
  //         .expect('Content-Type', /json/)
  //     })
  //   })
  // })
})

it.todo('mailchimp')
it.todo('user')
