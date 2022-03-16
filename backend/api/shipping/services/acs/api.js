'use strict'

const fetch = require('node-fetch')
const config = require('./config')
const { day, toId, formatAddress } = require('../../../../utils')
const { postcodeValidator } = require('postcode-validator')

async function fetchApi(url, method, body = {}) {
  const basicAuth = Buffer.from(
    `${config.auth.username}:${config.auth.password}`
  ).toString('base64')
  // ACS has not setup live testing api
  const endpoint =
    config.endpoint.live
    // process.env.NODE_ENV === 'production'
    //   ? config.endpoint.live
    //   : config.endpoint.test
  return await fetch(`${endpoint}${url}`, {
    method,
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? undefined : JSON.stringify(body),
  })
}

function toAcsUniqueSKU({ product, size }, existing = 0) {
  return `IC-${toId(product)}_${existing + 1}-${size}`
}

function rentalToShippingBody(rental) {
  const { id, shippingClass, product, size, charge, numInProgress } = rental
  const uniqueSKU =
    process.env.NODE_ENV === 'production'
      ? toAcsUniqueSKU({ product, size }, numInProgress)
      : 'IC-123_1-M' // ACS requires sku in their database

  // ACS does not have a testing environment so we have to set a date far in the future
  const range =
    process.env.NODE_ENV === 'production'
      ? rental.range
      : strapi.services.timing.range({
        rentalLength: 'short',
        expectedStart: day().add(50, 'year'),
      })

  const body = {
    AccountCode: config.auth.accountCode,
    OrderNumber: `IC-${id}`,

    DeliveryService: config.shippingClasses[shippingClass],
    DeliveryAgent: config.deliveryAgent,
    DeliveryCharge: 0,
    OrderCancelled: false,

    // OrderDate: range.confirmed?.format('YYYY-MM-DD'),
    OrderDate: day().format('YYYY-MM-DD'),
    DispatchDate: range.shipped.format('YYYY-MM-DD'),
    DeliveryDate: range.start.format('YYYY-MM-DD'),
    EventDate: range.start.format('YYYY-MM-DD'),
    WarehouseReturnDate: range.cleaning.format('YYYY-MM-DD'), // day after the order should end

    OrderItems: [
      {
        LineItemId: uniqueSKU, // should be unique per item in the array
        GarmentSKU: uniqueSKU,
        IsHire: true,
        ItemPrice: charge,
        Measurement1: 'ALL', //strapi.services.size.normalize(order.size),
        Measurement2: 'ALL', // strapi.services.size.normalize(order.size),
      },
    ],
  }

  return body
}

module.exports = {
  toAcsUniqueSKU,
  formatAddress,

  async ship({ recipient, rental }) {
    const body = Object.assign(
      rentalToShippingBody(rental),
      formatAddress(config, 'recipient', recipient)
    )
    strapi.log.info('shipping ', body)

    const res = await fetchApi(`/orders/${body.OrderNumber}`, 'PUT', body)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Request failed')
        } else {
          return await res.text()
        }
      })
      .catch((err) => {
        console.log(err, err.stack, err.message)
        strapi.log.error('ship %o', err.stack, err.message)
        throw new Error('Failed to ship order')
      })

    strapi.log.info('ship %o', res)
    return body.OrderNumber
  },
  verify: (postcode) =>
    postcodeValidator(postcode, 'UK') ||
    postcode === 'test' ||
    postcode === '55555',
}
