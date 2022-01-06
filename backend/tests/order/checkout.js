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
f.user = require('../user/factory')
f.designer = require('../product/designer-factory')

describe.only('On checkout', () => {
  it('works', async () => {
    const user = await f.user.create(strapi)
    const order = await f.order.create(strapi, {
      user: user.id,
      startDate: day({ year: 2050, date: 1, month: 1 }).format('YYYY-MM-DD'),
    })
    const contact = {
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
    }

    const checkoutData = await strapi.plugins[
      'orders'
    ].services.checkout.prepareData({
      user,
      orders: [order],
    })

    await strapi.plugins['orders'].services.checkout.onCheckout({
      contact,
      address: {
        addressLine1: 'Address Line 1',
        town: 'Town',
        postcode: 'EC2A 3QF',
      },
      ...checkoutData,
    })
  })
})

describe('Checkout', () => {
  let designer

  beforeAll(async () => {
    designer = await f.designer.create(strapi)
    await grantPrivileges(1, [
      'permissions.orders.controllers.order.create',
      'permissions.orders.controllers.checkout.checkoutUser',
    ])
    await grantPrivileges(2, [
      'permissions.orders.controllers.order.create',
      'permissions.orders.controllers.checkout.checkoutGuest',
      'permissions.orders.controllers.checkout.createPaymentIntent',
    ])
  })

  it('guest can checkout', async () => {
    let order
    let paymentIntent
    let paymentMethod
    let product = await f.product.create(strapi, {
      name: 'Product-1',
      slug: 'product-1',
      designer: designer.id,
    })
    let orderData = f.order.mock({
      startDate: day().add({ day: 10 }).format('YYYY-MM-DD'),
    })
    const userData = f.user.mock()
    const contact = {
      fullName: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
    }

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

    // create paymentMethod
    paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 1,
        exp_year: 2050,
        cvc: '314',
      },
    })
    expect(paymentMethod.id).toMatch(/^pm_/)

    // create paymentIntent and attach it to orders
    paymentIntent = await request(strapi.server)
      .post('/orders/checkout/payment-intents')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        orders: [order],
      })
      .expect(200)
      .then((data) => data.body)
    expect(paymentIntent.id).toMatch(/^pi_/)

    // checkout
    await request(strapi.server)
      .post('/orders/checkout')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        orders: [order],
        paymentIntent: paymentIntent.id,
        paymentMethod: paymentMethod.id,
        contact,
        address: {
          addressLine1: 'Address Line 1',
          town: 'Town',
          postcode: 'EC2A 3QF',
        },
      })
      .expect(200)
      .then((data) => {
        expect(data.body.success).toBe(true)
      })

    // changes order status to planning
    const checkedOut = await strapi
      .query('order', 'orders')
      .findOne({ id: order.id })
    expect(checkedOut).toMatchObject({
      ...orderData,
      startDate: day(checkedOut.startDate).format('YYYY-MM-DD'),
      address: {
        addressLine1: 'Address Line 1',
        email: contact.email,
        fullName: contact.fullName,
        postcode: 'EC2A 3QF',
        town: 'Town',
      },
      charge: 1000,
      coupon: null,
      email: contact.email,
      fullName: contact.fullName,
      nickName: null,
      // updates price of paymentIntent by creating a new one (eventually should update existing one however)
      paymentIntent: expect.not.stringMatching(paymentIntent.id),
      paymentMethod: paymentMethod.id,
      status: 'planning',
    })
  })

  it('user can checkout', async () => {
    let order
    let paymentIntent
    let paymentMethod
    let product = await f.product.create(strapi, {
      name: 'Product-2',
      slug: 'product-2',
      designer: designer.id,
    })
    const userData = f.user.mock()
    const orderData = f.order.mock({
      startDate: day().add({ day: 10 }).format('YYYY-MM-DD'),
    })
    const contact = {
      fullName: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
    }

    const { user, jwt } = await request(strapi.server) // app server is and instance of Class: http.Server
      .post('/auth/local/register')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(userData)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.jwt).toBeDefined()
        expect(data.body.user).toBeDefined()
        return {
          user: data.body.user,
          jwt: data.body.jwt,
        }
      })

    const orderId = await request(strapi.server)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      .send({
        ...orderData,
        product: product.id,
      })
      .expect('Content-Type', /json/)
      .then((res) => {
        return res.body.id
      })

    order = await strapi.query('order', 'orders').findOne({ id: orderId }, [])
    expect(order).toBeTruthy()
    expect(order.user).toBe(user.id)

    // create paymentMethod
    paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 1,
        exp_year: 2050,
        cvc: '314',
      },
    })
    expect(paymentMethod.id).toMatch(/^pm_/)

    // create paymentIntent and attach it to orders
    paymentIntent = await request(strapi.server)
      .post('/orders/checkout/payment-intents')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        orders: [order],
      })
      .expect(200)
      .then((data) => data.body)
    expect(paymentIntent.id).toMatch(/^pi_/)

    // checkout
    await request(strapi.server)
      .post(`/orders/checkout/${user.id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      .send({
        orders: [order],
        paymentIntent: paymentIntent.id,
        paymentMethod: paymentMethod.id,
        contact,
        address: {
          addressLine1: 'Address Line 1',
          town: 'Town',
          postcode: 'EC2A 3QF',
        },
      })
      .then((res) => {
        expect(res.body.status).toBe('success')
      })

    // changes order status to planning
    const checkedOut = await strapi
      .query('order', 'orders')
      .findOne({ id: order.id }, ['address'])
    expect(checkedOut).toMatchObject({
      ...orderData,
      startDate: day(checkedOut.startDate).format('YYYY-MM-DD'),
      address: {
        addressLine1: 'Address Line 1',
        email: contact.email,
        fullName: contact.fullName,
        postcode: 'EC2A 3QF',
        town: 'Town',
      },
      user: user.id,
      charge: 1000,
      coupon: null,
      email: contact.email,
      fullName: contact.fullName,
      nickName: null,
      // updates price of paymentIntent by creating a new one (eventually should update existing one however)
      paymentIntent: expect.not.stringMatching(paymentIntent.id),
      paymentMethod: paymentMethod.id,
      status: 'planning',
    })
  })
})
