const fetch = require('node-fetch')
const crypto = require('crypto')

const hivedApi = {
  parcels: 'https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels',
  postcodes: 'https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes',
  key: 'keyzCmMhMH9fvKBPV',
  shippingClasses: {
    zero: 'Same-Day',
    one: 'Next-Day',
    two: '2-Days',
  },
}

const addresses = {
  infinitecloset: {
    name: 'Infinite Closet',
    address: ['22 Horder Rd'],
    town: 'London',
    postcode: 'SW6 5EE',
    email: 'sarah.korich@infinitecloset.co.uk',
  },
  oxwash: {
    name: 'Oxwash',
    address: ['Avro House', 'Unit AH003', 'Havelock Terrace'],
    town: 'London',
    postcode: 'SW8 4AS',
    email: 'battersea@oxwash.com',
  },
}

function toSender(addr) {
  let res = {}
  function set(key, value) {
    if (value) {
      res[key] = value
    }
  }

  set('Sender', addr.name)
  set('Sender_Address_Line_1', addr.address[0])
  set('Sender_Address_Line_2', addr.address[1])
  set('Sender_Address_Line_3', addr.address[2])
  set('Sender_Town', addr.town)
  set('Sender_Postcode', addr.postcode)

  return res
}

function toCollection(addr) {
  let res = {}
  function set(key, value) {
    if (value) {
      res[key] = value
    }
  }

  set('Collection_Contact_Name', addr.name)
  set('Collection_Address_Line_1', addr.address[0])
  set('Collection_Address_Line_2', addr.address[1])
  set('Collection_Address_Line_3', addr.address[2])
  set('Collection_Town', addr.town)
  set('Collection_Postcode', addr.postcode)
  set('Collection_Instructions', addr.instructions)
  set('Collection_Phone_Number', addr.phone)
  set('Collection_Email_Address', addr.email)

  return res
}

function toRecipient(addr) {
  let res = {}
  function set(key, value) {
    if (value) {
      res[key] = value
    }
  }
  set('Recipient', addr.name)
  set('Recipient_Address_Line_1', addr.address[0])
  set('Recipient_Address_Line_2', addr.address[1])
  set('Recipient_Address_Line_3', addr.address[2])
  set('Recipient_Town', addr.town)
  set('Recipient_Postcode', addr.postcode)
  set('Recipient_Email_Address', addr.email)
  set('Recipient_Phone_Number', addr.phone)
  set('Delivery_Instructions', addr.instructions)

  return res
}

function toAddress(order) {
  const { address, user } = order
  return {
    name: address.firstName + ' ' + address.lastName,
    address: [address.address],
    town: address.town,
    postcode: address.postcode,
    email: user.email,
    phone: user.phoneNumber,
  }
}

async function fetchHived(url, method, body = {}) {
  return fetch(url, {
    method,
    headers: {
      Authorization: 'Bearer ' + hivedApi.key,
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

const api = {
  shipment: {
    ship: (shipment) => fetchHived(hivedApi.parcels, 'POST', shipment),
    retrieve: (shipment) =>
      fetchHived(`${hivedApi.parcels}/${shipment}`, 'GET'),
    complete: (shipment) =>
      fetchHived(`${hivedApi.parcels}/${shipment}`, 'GET').then(
        (res) => res.Tracking_ID_Complete === 'COMPLETE'
      ),
  },
  postcode: {
    verify: (postcode) =>
      fetchHived(hivedApi.postcodes, 'POST', { Recipient_Postcode: postcode }),
  },
}

async function verify(postcode) {
  let valid

  try {
    const res = await api.postcode.verify(postcode)
    valid = res.fields.Address_in_Delivery_Area === 'Valid'
  } catch (e) {
    valid = false
  }

  return valid
}

async function ship(order) {
  const price = strapi.plugins['orders'].services.price.price(order)
  const orderAddress = toAddress(order)

  let hivedBody = {
    Shipping_Class: hivedApi.shippingClasses.two,
    Sender: 'Infinite Closet',
    Value_GBP: price,
    ...toSender(addresses.infinitecloset),
    // Sender_Chosen_Collection_Date: MM/DD/YYYY
    // Sender_Chosen_Delivery_Date: MM/DD/YYYY
  }

  // TODO: move this logic to callers
  if (order.status === 'shipping') {
    Object.assign(
      hivedBody,
      toCollection(addresses.infinitecloset),
      toRecipient(orderAddress),
      {
        Shipping_Class:
          hivedApi.shippingClasses[
            strapi.plugins['orders'].services.date.shippingClass(order) || 'one'
          ],
      }
    )
  } else if (order.status === 'cleaning') {
    Object.assign(
      hivedBody,
      toCollection(orderAddress),
      toRecipient(addresses.oxwash),
      { Shipping_Class: hivedApi.shippingClasses.two }
    )
  }

  if (process.env.NODE_ENV === 'production') {
    const res = await api.shipment.ship(hivedBody)
    strapi.log.info('hived:ship %o', res)
    return res
  } else {
    return { id: crypto.randomBytes(16).toString('base64') }
  }
}

module.exports = { fetchHived, api, verify, ship }
