/**
 * @group api
 * @group order/checkout
 */
'use strict'
const request = require('supertest')
const { day } = require('../../utils')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { grantPrivileges } = require('../helpers/strapi')
const f = {}
f.product = require('../product/factory')
f.order = require('./factory')

describe('Checkout', () => {
  let order
  let product
  let paymentIntent
  let paymentMethod

  beforeAll(async () => {
    await grantPrivileges(2, [
      'permissions.orders.controllers.order.create',
      'permissions.orders.controllers.checkout.checkoutGuest',
      'permissions.orders.controllers.checkout.checkoutUser',
      'permissions.orders.controllers.checkout.createPaymentIntent',
    ])
    product = await f.product.create(strapi, {})
  })

  // onCheckout is a very core to all checkout actions so it makes sense to rigorously test it
  it('onCheckout core function works', async () => {
  })

  it('guest can checkout', async () => {
    let orderData = f.order.mock({
      startDate: day().add({ day: 10 }),
    })

    const orderId = await request(strapi.server)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        ...orderData,
        product: product.id,
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        return res.body.id
      })

    order = await strapi.query('order', 'orders').findOne({ id: orderId })
    expect(order).toBeTruthy()

    // can create paymentIntent
    paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 1,
        exp_year: 2050,
        cvc: '314',
      },
    })

    // can create paymentIntent
    paymentIntent = await request(strapi.server)
      .post('/orders/checkout/payment-intents')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        orders: [order],
      })
      .expect(200)
      .then(data => data.body)

    // can checkout
    await request(strapi.server)
      .post('/orders/checkout')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        orders: [order],
        paymentIntent: paymentIntent.id,
        paymentMethod: paymentMethod.id,
        contact: {
          fullName: 'Infinite Closet',
          email: 'info+test@infinitecloset.co.uk',
        },
      })
      .expect(200)
      .then((data) => {
        expect(data.body.success).toBe(true)
      })
  })

  it.skip('user can checkout', async () => {
    let orderData = f.order.mock({
      startDate: day().add({ day: 10 }),
    })

    const orderId = await request(strapi.server)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        ...orderData,
        product: product.id,
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        return res.body.id
      })

    order = await strapi.query('order', 'orders').findOne({ id: orderId })
    expect(order).toBeTruthy()

    // can create paymentIntent
    paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 1,
        exp_year: 2050,
        cvc: '314',
      },
    })

    // can create paymentIntent
    paymentIntent = await request(strapi.server)
      .post('/orders/checkout/payment-intents')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        orders: [order],
      })
      .expect(200)
      .then(data => data.body)

    // can checkout
    await request(strapi.server)
      .post('/orders/checkout')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        orders: [order],
        paymentIntent: paymentIntent.id,
        paymentMethod: paymentMethod.id,
        contact: {
          fullName: 'Infinite Closet',
          email: 'info+test@infinitecloset.co.uk',
        },
      })
      .expect(200)
      .then((data) => {
        expect(data.body.success).toBe(true)
      })
  })
})
