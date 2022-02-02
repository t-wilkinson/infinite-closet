'use strict'
const fetch = require('node-fetch')
const config = require('./config')
const { formatAddress } = require('../../../../utils')
const { postcodeValidator } = require('postcode-validator')

async function fetchApi(url, method, body = {}) {
  const basicAuth = Buffer.from(
    `${config.auth.username}:${config.auth.password}`
  ).toString('base64')
  const endpoint =
    process.env.NODE_ENV === 'production'
      ? config.endpoint.live
      : config.endpoint.test
  return await fetch(`${endpoint}${url}`, {
    method,
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? undefined : JSON.stringify(body),
  })
}

module.exports = {
  formatAddress,

  // TODO: accept multiple orders
  async ship({ recipient, cartItem }) {
    const { order, range, totalPrice, shippingClass } = cartItem
    const uniqueSKU = await strapi.plugins[
      'orders'
    ].services.order.acsUniqueSKU(order)

    const body = Object.assign(
      {
        AccountCode: config.auth.accountCode,
        OrderNumber: `IC-${order.id}`,

        DeliveryService: config.shippingClasses[shippingClass],
        DeliveryAgent: config.deliveryAgent,
        DeliveryCharge: 0,
        OrderCancelled: false,

        OrderDate: range.created.format('YYYY-MM-DD'),
        DispatchDate: range.shipped.format('YYYY-MM-DD'),
        DeliveryDate: range.start.format('YYYY-MM-DD'),
        EventDate: range.start.format('YYYY-MM-DD'),
        WarehouseReturnDate: range.cleaning.format('YYYY-MM-DD'), // day after the order should end

        OrderItems: [
          {
            LineItemId: uniqueSKU, // should be unique per item in the array
            GarmentSKU: uniqueSKU,
            IsHire: true,
            ItemPrice: totalPrice,
            Measurement1: 'ALL', //strapi.services.size.normalize(order.size),
            Measurement2: 'ALL', // strapi.services.size.normalize(order.size),
          },
        ],
      },
      formatAddress(config, 'recipient', recipient)
    )

    if (process.env.NODE_ENV !== 'production') {
      return Math.random().toString().slice(2)
    }

    const res = await fetchApi(`/orders/${body.OrderNumber}`, 'PUT', body)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Request failed')
        } else {
          return await res.json()
        }
      })
      .catch((err) => {
        strapi.log.error('ship %o', err.stack, err.message)
        throw new Error('Failed to ship order')
      })

    strapi.log.info('ship %o', res)
    return body.OrderNumber
  },
  retrieve: () => {},
  complete: () => {},
  verify: (postcode) => postcodeValidator(postcode, 'UK'),
}
