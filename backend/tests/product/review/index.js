/**
 * @group api
 * @group product/review
 */
'use strict'
const {
  jsonRequestAuth,
  jsonRequest,
  grantPrivileges,
} = require('../../helpers/strapi')
const f = {}
f.product = require('../factory')
f.order = require('../../order/factory')
f.user = require('../../user/factory')
f.review = require('./factory')

describe('Add review', () => {
  beforeAll(async () => {
    await grantPrivileges(1, ['permissions.application.controllers.review.add'])
  })

  it('can add review completed order when has not created review yet', async () => {
    let review = f.review.mock()
    const order = await f.order.create(strapi, { status: 'completed' })
    await jsonRequestAuth(`/products/${order.product.slug}/reviews`, {
      body: review,
      user: order.user,
    }).then((res) => {
      expect(res.body.review).toMatchObject(review)
    })
  })

  it('should not create multiple reviews for the same order', async () => {
    let review = f.review.mock()
    const order = await f.order.create(strapi, { status: 'completed' })
    const { product, user } = order
    await jsonRequestAuth(`/products/${product.slug}/reviews`, {
      body: review,
      user,
    })
      .expect(200)
      .then((res) => {
        expect(res.body.review).toMatchObject(review)
      })
    await jsonRequestAuth(`/products/${product.slug}/reviews`, {
      body: review,
      user,
    }).expect(404)
  })

  it("can't review product user has not owned", async () => {
    const product = await f.product.create(strapi)
    const user = await f.user.create(strapi)
    const review = f.review.mock()
    await jsonRequestAuth(`/products/${product.slug}/reviews`, {
      body: review,
      user,
    }).expect(404)
  })

  it("can't review non-existent product", async () => {
    const review = f.review.mock()
    const user = await f.user.create(strapi)
    await jsonRequestAuth(`/products/INVALID/reviews`, {
      body: review,
      user,
    }).expect(404)
  })
})

describe('Product reviews', () => {
  beforeAll(async () => {
    await grantPrivileges(2, [
      'permissions.application.controllers.review.productReviews',
    ])
  })

  it("shouldn't show orders that don't have reviews", async () => {
    const product = await f.product.create(strapi)
    const review = await f.review.create(strapi)
    await f.order.create(strapi, { product: product.id, review: review.id })
    await f.order.create(strapi, { product: product.id })

    await jsonRequest(`/products/${product.slug}/reviews`, {
      method: 'GET',
    }).then((res) => {
      expect(res.body.orders.length).toBe(1)
    })
  })
})
