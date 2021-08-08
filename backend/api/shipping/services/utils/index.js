const fetch = require('node-fetch')

/**
 * @typedef {Object} ShippingAddress
 * @property {string} name
 * @property {string[]} address
 * @property {string} town
 * @property {string} postcode
 * @property {string} email
 * @property {string=} phone
 */

const config = {
  parcels: 'https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels',
  postcodes: 'https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes',
  key: 'keyzCmMhMH9fvKBPV',
  shippingClasses: {
    zero: 'Same-Day',
    one: 'Next-Day',
    two: '2-Days',
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

module.exports = {
  config,
  fetchHived,
}
