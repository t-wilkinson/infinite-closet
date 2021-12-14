'use strict'
const fetch = require('node-fetch')
const crypto = require('crypto')
const config = require('./config')
const { splitName } = require('../../../../utils')

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
  return fetch(url, {
    method,
    headers: {
      Authorization: 'Bearer ' + config.key,
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
  formatAddress,
  async ship({
    sender = config.addresses.infinitecloset,
    collection,
    recipient,
    shippingClass,
    shipmentPrice,
  }) {
    const body = Object.assign(
      {
        Shipping_Class: config.shippingClasses[shippingClass],
        Sender: 'Infinite Closet',
        Value_GBP: shipmentPrice,
      },
      formatAddress(config.addressFormats.sender, sender),
      formatAddress(config.addressFormats.recipient, recipient),
      formatAddress(config.addressFormats.collection, collection)
    )

    strapi.log.info('ship %o', body)
    if (process.env.NODE_ENV === 'production') {
      const res = await fetchApi(config.parcels, 'POST', body)
      strapi.log.info('hived:ship %o', res)
      return res.id
    } else {
      return crypto.randomBytes(16).toString('base64')
    }
  },
  retrieve: (shipment) => fetchApi(`${config.parcels}/${shipment}`, 'GET'),
  complete: (shipment) =>
    fetchApi(`${config.parcels}/${shipment}`, 'GET').then(
      (res) => res.Tracking_ID_Complete === 'COMPLETE'
    ),
  verify: (postcode) => {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      return fetchApi(config.postcodes, 'POST', {
        Recipient_Postcode: postcode,
      })
        .then((res) => res.fields.Address_in_Delivery_Area === 'Valid')
        .catch(() => false)
    } else {
      return true
    }
  },
}
