/**
 * @group api
 * @group order
 * @group order/checkout
 * @group product
 * @group product/review
 */
'use strict'
const fs = require('fs')
const { setupStrapi } = require('./helpers/strapi')

jest.setTimeout(15000)

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

beforeAll(async () => {
  await setupStrapi() // singleton so it can be called many times
  await Promise.all([
    strapi.query('review').delete(),
    strapi.query('designer').delete(),
    strapi.query('product').delete(),
    strapi.query('coupon').delete(),
    strapi.query('order', 'orders').delete(),
    strapi.query('user', 'users-permissions').delete(),
  ])
})

afterAll(async () => {
  await strapi.server.close()
  await sleep(1000) // clear database connection

  /*
  const dbSettings = strapi.config.get('database.connections.default.settings')

  // delete test database after all tests
  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${__dirname}/../${dbSettings.filename}`
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile)
    }
  }
  */

})

describe('Strapi in general', () => {
  it('strapi is defined', async () => {
    expect(strapi).toBeDefined()
  })
})

require('./order')
// require('./product')
// require('./user')
