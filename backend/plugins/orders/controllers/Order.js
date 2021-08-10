'use strict'

const { generateAPI } = require('../../../api/utils')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
const isBetween = require('dayjs/plugin/isBetween')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = {
  ...generateAPI('order', 'orders'),

  async amount(ctx) {
    const body = ctx.request.body
    const amount = strapi.plugins['orders'].services.price.amount(body.order)
    ctx.send({ amount })
  },

  // TODO: remove this, use PUT instead
  async complete(ctx) {
    const body = ctx.request.body
    const { order } = body
    const res = await strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'completed' })
    ctx.send({
      order: res,
    })
  },

  // TODO: should check if product.sizes includes order.size
  async create(ctx) {
    const body = ctx.request.body
    const user = ctx.state.user

    if (!['cart', 'list'].includes(body.status)) {
      return
    }

    const order = await strapi.plugins['orders'].services.order.create({
      user: user.id,
      status: body.status,
      size: body.size,
      product: body.product,
      startDate: body.date,
      rentalLength: body.rentalLength,
    })

    ctx.send({
      order,
    })
  },

  async status(ctx) {
    const user = ctx.state.user

    let orders = await strapi
      .query('order', 'orders')
      .find({ user: user.id }, [
        'product',
        'product.designer',
        'product.images',
      ])

    for (const order of orders) {
      strapi.services.shipment.shippingClass(order.created_at, order.startDate)
      order.price = strapi.plugins['orders'].services.price.price(order)
    }

    ctx.send({
      orders,
    })
  },

  // TODO: should only take order id
  async ship(ctx) {
    let { order } = ctx.request.body
    if (order.status === 'shipping') {
      ctx.send({ message: 'Already shipping' })
    }

    order = await strapi.query('order', 'orders').update(
      { id: order.id },
      {
        status: 'shipping',
        shippingDate: strapi.services.timing.day().toJSON(),
      }
    )
    order = await strapi // TODO: can we do this in the update statement?
      .query('order', 'orders')
      .findOne({ id: order.id }, [
        'address',
        'product',
        'user',
        'product.designer',
        'product.images',
        'product.sizes',
      ])
    const user = order.user
    const orderPrice = strapi.plugins['orders'].services.price.price(order)

    const sendShippingEmail = () =>
      strapi.plugins['email'].services.email.send({
        template: 'order-shipped',
        to: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        subject: `Your order of ${order.product.name} by ${order.product.designer.name} has shipped!`,
        data: {
          ...order,
          firstName: user.firstName,
          range: strapi.services.timing.range(order),
          price: orderPrice,
        },
      })

    const shippingRequest = {
      collection: 'infinitecloset',
      recipient:
        strapi.plugins['orders'].services.order.toShippingAddress(order),
      shippingClass: strapi.services.shipment.shippingClass(
        order.created_at,
        order.startDate
      ),
      shipmentPrice: orderPrice,
    }

    strapi.services.shipment
      .ship(shippingRequest)
      .then((res) =>
        strapi
          .query('order', 'orders')
          .update({ id: order.id }, { shipment: res.id })
      )
      .then(sendShippingEmail)
      .catch((err) =>
        strapi.plugins['orders'].services.order.shippingFailure(order, err)
      )

    ctx.send({ order })
  },
}
