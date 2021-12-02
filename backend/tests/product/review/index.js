/**
 * @group api
 * @group product/review
 */
'use strict'
const request = require('supertest')
const { day } = require('../../../utils')
const { jsonRequestAuth, grantPrivileges } = require('../../helpers/strapi')
const f = {}
f.product = require('../factory')
f.order = require('../../order/factory')
f.user = require('../../user/factory')
f.review = require('./factory')

describe('Add review', () => {
  let order
  let user

  beforeAll(async () => {
    await grantPrivileges(1, [
      'permissions.application.controllers.review.add',
      'permissions.application.controllers.review.productReviews',
    ])
    await grantPrivileges(2, [
      'permissions.application.controllers.review.productReviews',
    ])

    let product = await f.product.create(strapi)
    user = await f.user.create(strapi)
    order = await f.order.create(strapi, {product: product.id, user: user.id, status: 'completed'})
  })

  it('should not create multiple reviews for the same order', async () => {
    let review = f.review.mock()
    await jsonRequestAuth(`/products/${order.product.slug}/reviews`, review, user)
      .then((res) => {
        expect(res.body.review).toMatchObject(review)
      })
    await jsonRequestAuth(`/products/${order.product.slug}/reviews`, review, user)
      .expect(404)
  })

  it('can\'t review product user has not owned', async () => {
    let product = await f.product.create(strapi)
    let review = f.review.mock()
    await jsonRequestAuth(`/products/${product.slug}/reviews`, review, user)
      .expect(404)
  })

  it('can\'t review non-existent product', async () => {
    let review = f.review.mock()
    await jsonRequestAuth(`/products/INVALID/reviews`, review, user)
      .expect(404)
  })
})
