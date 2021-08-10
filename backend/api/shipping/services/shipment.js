const fetch = require('node-fetch')
const crypto = require('crypto')
const { day } = require('./utils')

const HOURS_IN_DAY = 24

const config = {
  parcels: 'https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels',
  postcodes: 'https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes',
  key: 'keyzCmMhMH9fvKBPV',
  cutoff: 12,
  shippingClasses: {
    zero: 'Same-Day',
    one: 'Next-Day',
    two: '2-Days',
  },
  shippingClassesHours: {
    one: 1 * HOURS_IN_DAY,
    two: 2 * HOURS_IN_DAY,
  },
  addresses: {
    infinitecloset: {
      name: 'Infinite Closet',
      address: ['22 Horder Rd'],
      town: 'London',
      postcode: 'SW6 5EE',
      phone: '07539 433208',
      email: 'sarah.korich@infinitecloset.co.uk',
    },
    oxwash: {
      name: 'Oxwash',
      address: ['Avro House', 'Unit AH003', 'Havelock Terrace'],
      town: 'London',
      postcode: 'SW8 4AS',
      email: 'battersea@oxwash.com',
    },
  },
  formats: {
    sender: {
      name: 'Sender',
      address: [
        'Sender_Address_Line_1',
        'Sender_Address_Line_2',
        'Sender_Address_Line_3',
      ],
      town: 'Sender_Town',
      postcode: 'Sender_Postcode',
    },
    collection: {
      name: 'Collection_Contact_Name',
      address: [
        'Collection_Address_Line_1',
        'Collection_Address_Line_2',
        'Collection_Address_Line_3',
      ],
      town: 'Collection_Town',
      postcode: 'Collection_Postcode',
      email: 'Collection_Email_Address',
      phone: 'Collection_Phone_Number',
      deliveryInstructions: 'Collection_Instructions',
    },
    recipient: {
      name: 'Recipient',
      address: [
        'Recipient_Address_Line_1',
        'Recipient_Address_Line_2',
        'Recipient_Address_Line_3',
      ],
      town: 'Recipient_Town',
      postcode: 'Recipient_Postcode',
      email: 'Recipient_Email_Address',
      phone: 'Recipient_Phone_Number',
      deliveryInstructions: 'Delivery_Instructions',
    },
  },
}

async function fetchHived(url, method, body = {}) {
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

/**
 * @typedef {Object} Address
 * @property {string} name - Name of individual who address is attached to
 * @property {string[]} address - Up to 3 address lines
 * @property {string} town
 * @property {string} postcode
 * @property {string} email
 * @property {string} phone
 * @property {string} deliveryInstructions
 */

/**
 * Format address according to specification
 * @param {Object} format - Mapping of address fields to api fields
 * @param {Address} addr
 * @returns {Object} Address with fields set by specification
 */
function formatAddress(format, addr) {
  if (typeof addr === 'string') {
    return config.addresses[addr]
  } else {
    return Object.entries(addr).reduce((acc, [key, value]) => {
      if (!value || !format[key]) {
        return acc
      }
      if (key === 'address') {
        for (const [index, line] of format.address) {
          acc[line] = value[index]
        }
      } else {
        acc[format[key]] = value
      }
      return acc
    }, {})
  }
}

const api = {
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
      formatAddress(config.formats.sender, sender),
      formatAddress(config.formats.recipient, recipient),
      formatAddress(config.formats.collection, collection)
    )

    strapi.log.info('hived:ship %o', body)
    if (process.env.NODE_ENV === 'production') {
      const res = await fetchHived(config.parcels, 'POST', body)
      strapi.log.info('hived:ship %o', res)
      return res
    } else {
      return { id: crypto.randomBytes(16).toString('base64') }
    }
  },
  retrieve: (shipment) => fetchHived(`${config.parcels}/${shipment}`, 'GET'),
  complete: (shipment) =>
    fetchHived(`${config.parcels}/${shipment}`, 'GET').then(
      (res) => res.Tracking_ID_Complete === 'COMPLETE'
    ),
  verify: (postcode) =>
    fetchHived(config.postcodes, 'POST', { Recipient_Postcode: postcode })
      .then((res) => res.fields.Address_in_Delivery_Area === 'Valid')
      .catch(() => false),
}

// TODO: Where to put the following functions?
/**
 * Determine when an item will likely arrive, given shipping info
 * @param {DayLike} sent - When the item is sent
 * @param {ShippingClass} shippingClass
 * @returns {DateLike} When item will arrive
 */
function arrival(sent, shippingClass = 'one') {
  sent = day(sent)
  const hoursSendClient = config.shippingClassesHours[shippingClass]
  let offset
  if (sent.hour() > config.cutoff) {
    offset = HOURS_IN_DAY
  } else {
    offset = 0
  }
  return sent.add(hoursSendClient + offset, 'hours').hour(config.cutoff)
}

/**
 * Returns cheapest {@link ShippingClass} given time constraints on when it can leave and arrive.
 * @param {DateLike} orderedOn
 * @param {DateLike} startsOn
 * @returns {ShippingClass}
 */
function shippingClass(orderedOn, startsOn) {
  orderedOn = day(orderedOn)
  startsOn = day(startsOn)

  if (!orderedOn) {
    return undefined
  }
  if (startsOn.isSameOrAfter(arrival(orderedOn, 'two'), 'day')) {
    return 'two'
  } else if (startsOn.isSameOrAfter(arrival(orderedOn, 'one'), 'day')) {
    return 'one'
  } else {
    return undefined
  }
}

/**
 * Like {@link shippingClass} but returns hours shipping will take
 * @returns {number}
 */
function shippingClassHours(orderedOn, startsOn) {
  return (
    config.shippingClassesHours[shippingClass(orderedOn, startsOn)] ||
    config.shippingClassesHours.two
  )
}

module.exports = {
  arrival,
  shippingClass,
  shippingClassHours,
  ...api,
}
