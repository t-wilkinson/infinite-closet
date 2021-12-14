'use strict'
const fetch = require('node-fetch')
// const crypto = require('crypto')
const config = require('./config')
const timing = require('../timing')
const { splitName } = require('../../../../utils')
const { postcodeValidator } = require('postcode-validator')

/**
 * Format address according to specification
 * @param {Object} format - Mapping of address fields to api fields
 * @param {Address} addr
 * @returns {Object} Address with fields set by specification
 */
function formatAddress(format, addr) {
  if (typeof addr === 'string') {
    return formatAddress(format, config.addresses[addr])
  }

  return Object.entries(addr).reduce((acc, [key, value]) => {
    if (!value || !format[key]) {
      return acc
    }

    if (key === 'address') {
      for (const i in format.address) {
        if (format.address[i] && value[i]) {
          acc[format.address[i]] = value[i]
        }
      }

      // In case format requires seperate field for first and last name
    } else if (key === 'name' && Array.isArray(format[key])) {
      const { firstName, lastName } = splitName(value)
      acc[format.name[0]] = firstName
      acc[format.name[1]] = lastName
    } else {
      acc[format[key]] = value
    }
    return acc
  }, {})
}

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
  }).then((res) => console.log(res))
  // .then((res) => res.json())
}

module.exports = {
  formatAddress,

  // TODO: accept multiple orders
  async ship({ recipient, shippingClass, shipmentPrice, order }) {
    // if (process.env.NODE_ENV !== 'production') {
    //   return crypto.randomBytes(16).toString('base64')
    // }

    const range = timing.range(order)
    const uniqueSKU = await strapi.plugins[
      'orders'
    ].services.order.acsUniqueSKU(order)

    const body = Object.assign(
      {
        AccountCode: config.auth.accountCode,
        OrderNumber: order.id,

        DeliveryService: config.shippingClasses[shippingClass],
        DeliveryAgent: config.deliveryAgent,
        DeliverCharge: 0,
        OrderCancelled: false,

        OrderDate: range.created.format('YYYY-MM-DD'),
        DispatchDate: range.shipped.format('YYYY-MM-DD'),
        DeliveryDate: range.start.format('YYYY-MM-DD'),
        EventDate: range.start.format('YYYY-MM-DD'),
        WarehouseReturnDate: range.cleaning.format('YYYY-MM-DD'), // day after the order should end

        OrderItems: [
          {
            LineItemId: uniqueSKU,
            GarmentSKU: order.product.id,
            IsHire: true,
            ItemPrice: shipmentPrice,
            Measurement1: strapi.services.size.normalize(order.size),
            Measurement2: strapi.services.size.normalize(order.size),
          },
        ],
      },
      formatAddress(config.addressFormats.recipient, recipient)
    )

    const res = await fetchApi(
      `/orders/${body.OrderNumber}`,
      'PUT',
      body
    ).catch((err) => {
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
