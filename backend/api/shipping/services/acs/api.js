'use strict'
const fetch = require('node-fetch')
// const crypto = require('crypto')
const config = require('./config')
const timing = require('../timing')
const { formatAddress } = require('../../../../utils')
const { postcodeValidator } = require('postcode-validator')


async function fetchApi(url, method, body = {}) {
  const basicAuth = Buffer.from(
    `${config.auth.username}:${config.auth.password}`
  ).toString('base64')
  const endpoint = config.endpoint.live
    // process.env.NODE_ENV === 'production'
    //   ? config.endpoint.live
    //   : config.endpoint.test
  return fetch(`${endpoint}${url}`, {
    method,
    headers: {
      Auth: `BasicAuth: ${config.auth.username},${config.auth.password}`,
      Authorization: `Basic ${basicAuth}`,
      // 'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body:
      method === 'GET'
        ? undefined
        : JSON.stringify({
            fields: body,
          }),
  })
  // .then((res) => res.json())
}

module.exports = {
  formatAddress,

  // TODO: accept multiple orders
  async ship({ recipient, shippingClass, shipmentPrice, order }) {
    console.log('ship')

    // TODO!
    const range = timing.range({...order, startDate: '2050-01-01', shippingDate: undefined})
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
            LineItemId: uniqueSKU,
            GarmentSKU: uniqueSKU, //`IC-${order.product.id}`,
            IsHire: true,
            ItemPrice: shipmentPrice,
            Measurement1: 'ALL', //strapi.services.size.normalize(order.size),
            Measurement2: 'ALL', // strapi.services.size.normalize(order.size),
          },
        ],
      },
      formatAddress(config, 'recipient', recipient)
    )
    console.log(body)

    const res = await fetchApi(`/orders/${body.OrderNumber}`, 'PUT', body)
      .then((res) => {
        console.log(res)
        console.log('res')
        if (!res.ok) {
          return res.text()
        } else {
          return res.json()
        }
      })
      .then(res => {
        console.log(res)
      })
      .catch((err) => {
        console.log('err')
        console.dir(err)
        console.log(err.message)
        throw err
      })
    strapi.log.info('hived:ship %o', res)
    throw new Error('TODO')
    return body.OrderNumber
  },
  retrieve: () => {},
  complete: () => {},
  verify: (postcode) => postcodeValidator(postcode, 'UK'),
}
