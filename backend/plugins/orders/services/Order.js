'use strict'

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const inProgress = (status) =>
  ['planning', 'shipping', 'cleaning'].includes(status)

// identifies order with size and product id
function toKey(order) {
  let productID
  if (order.product === undefined) {
    productID = undefined
  } else if (order.product.id !== undefined) {
    productID = order.product.id
  } else {
    productID = order.product
  }
  return `${order.size}_${productID}`
}

// calculate available product quantities by date based on overlapping orders
// dates: {order key: date range[]}
function numAvailable(orders, dates) {
  const numAvailable = orders.reduce((counter, order) => {
    const key = toKey(order)
    const { product } = order

    // set default available product quantity
    if (!(key in counter)) {
      const defaultSize = { quantity: 0 }
      const productSize =
        product.sizes.find(({ size }) => size === order.size) || defaultSize
      counter[key] = productSize.quantity
    }

    // no dates will overlap
    if (!(key in dates)) {
      return counter
    }

    const orderDateRange =
      order.range || strapi.plugins['orders'].services.date.range(order)

    // if date ranges overlap, reduce available product quantity
    const overlaps = dates[key].reduce((acc, date) => {
      if (acc) {
        return acc
      }
      const overlaps =
        date &&
        strapi.plugins['orders'].services.date.overlap(date, orderDateRange) &&
        inProgress(order.status)
      return overlaps
    }, false)

    if (overlaps) {
      counter[key] -= 1
    }

    return counter
  }, {})

  return numAvailable
}

async function quantity(order) {
  if (!order.product.sizes) {
    order.product = await strapi.query('product').findOne(
      {
        id:
          typeof order.product === 'number' ? order.product : order.product.id,
      },
      ['sizes']
    )
  }
  const size = order.product.sizes.find((size) =>
    strapi.services.size.contains(order, size.size)
  )
  if (size) {
    return size.quantity
  } else {
    return 0
  }
}

async function notifyArrival(orders) {
  for (const order of orders) {
    const user = order.user
    const range = strapi.plugins['orders'].services.date.range(order)
    const date = strapi.plugins['orders'].services.date.day(range.start)
    const today = strapi.plugins['orders'].services.date.day()

    if (!date.isSame(today, 'day')) continue
    // const complete = await strapi.plugins[
    //   'orders'
    // ].services.hived.api.shipment.complete(order.shipment);
    // if (!complete) return;

    strapi.log.info('order arriving %o', order.id)
    strapi.plugins['email'].services.email.send({
      template: 'order-arriving',
      to: user.email,
      subject: `Your order of ${order.product.name} by ${order.product.designer.name} is arriving today`,
      data: {
        ...order,
        firstName: user.firstName,
        range,
        price: strapi.plugins['orders'].services.price.price(order),
      },
    })
  }
}

async function sendToCleaners(orders) {
  for (const order of orders) {
    const user = order.user
    const range = strapi.plugins['orders'].services.date.range(order)
    const date = strapi.plugins['orders'].services.date.day(range.end)
    const today = strapi.plugins['orders'].services.date.day()
    if (!date.isSame(today, 'day')) continue

    strapi.log.info('cleaning order %o', order.id)
    strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'cleaning' })
      .then(() => strapi.plugins['orders'].services.hived.ship(order))
      .then(() =>
        strapi.plugins['email'].services.email.send({
          template: 'order-leaving',
          to: user.email,
          cc: 'battersea@oxwash.com',
          subject: `Your order of ${order.product.name} by ${order.product.designer.name} is ending today`,
          data: {
            ...order,
            firstName: user.firstName,
            range,
            price: strapi.plugins['orders'].services.price.price(order),
          },
        })
      )
  }
}

// calculate number of available products for each cart item
async function numAvailableCart(cart = []) {
  const reqRanges = cart.reduce((acc, order) => {
    const key = toKey(order)
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(strapi.plugins['orders'].services.date.range(order))
    return acc
  }, {})

  // attach `sizes` component to `order.product.sizes`
  let orders = await strapi.query('order', 'orders').find({}, [])
  orders = await Promise.all(
    orders.map(async (order) => {
      order.product = await strapi
        .query('product')
        .findOne({ id: order.product }, ['sizes'])
      return order
    })
  )

  return numAvailable(orders, reqRanges)
}

async function create({
  user,
  status,
  size,
  product,
  startDate,
  rentalLength,
}) {
  const orderBody = {
    user,
    status,
    size,
    product,
    startDate,
    rentalLength,
  }
  return await strapi.query('order', 'orders').create(orderBody)
}

module.exports = {
  toKey,
  inProgress,
  numAvailable,
  notifyArrival,
  quantity,
  sendToCleaners,
  numAvailableCart,
  create,
}
