'use strict'
const fetch = require('node-fetch')
const crypto = require('crypto')
const config = require('./config')
const timing = require('./timing')
const { formatAddress } = require('./shipment')
const { postcodeValidator } = require('postcode-validator')

async function fetchApi(url, method, body = {}) {
  const basicAuth = Buffer.from(
    `${config.auth.username}:${config.auth.password}`
  ).toString('base64')
  const endpoint =
    process.env.NODE_ENV === 'production'
      ? config.endpoint.live
      : config.endpoint.test
  return fetch(`${endpoint}${url}`, {
    method,
    headers: {
      Authorization: 'Basic ' + basicAuth,
      'Content-Type': 'application/json',
    },
    body:
      method === 'GET'
        ? undefined
        : JSON.stringify({
          fields: body,
        }),
  }).then((res) => res.json())
}

module.exports = {
  async ship({ recipient, shippingClass, shipmentPrice, order }) {
    if (process.env.NODE_ENV !== 'production') {
      return { id: crypto.randomBytes(16).toString('base64') }
    }

    const range = timing.range(order)

    const body = Object.assign(
      {
        AccountCode: config.auth.accountCode,
        OrderNumber: order.id,
        ItemLineID: undefined,
        GarmentSKU: undefined,
        ItemPrice: shipmentPrice,
        DeliveryService: config.shippingClasses[shippingClass],
        DeliveryAgent: undefined,
        DeliveryCharge: 0,
        IsHire: true,
        Measurement1: strapi.services.size.normalize(order.size),
        Measurement2: strapi.services.size.normalize(order.size),

        OrderDate: range.created.format('YYYY-MM-DD'),
        DispatchDate: range.shipped.format('YYYY-MM-DD'),
        DeliveryDate: range.start.format('YYYY-MM-DD'),
        EventDate: range.start.format('YYYY-MM-DD'), // TODO: what is the difference between this and DeliveryDate?
        WarehouseReturnDate: range.cleaning.format('YYYY-MM-DD'), // day after the order should end
      },
      formatAddress(config.addressFormats.recipient, recipient)
    )

    const res = await fetchApi(`/orders/${body.OrderNumber}`, 'PUT', body)
    strapi.log.info('hived:ship %o', res)
    return res
  },
  retrieve: () => {},
  complete: () => {},
  verify: (postcode) => postcodeValidator(postcode, 'UK'),
}
