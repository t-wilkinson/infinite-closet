const crypto = require('crypto')
const { config, fetchHived } = require('./utils')

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

const senderFormat = {
  name: 'Sender',
  address: [
    'Sender_Address_Line_1',
    'Sender_Address_Line_2',
    'Sender_Address_Line_3',
  ],
  town: 'Sender_Town',
  postcode: 'Sender_Postcode',
}

const collectionFormat = {
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
}

const recipientFormat = {
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
}

module.exports = {
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
      formatAddress(senderFormat, sender),
      formatAddress(recipientFormat, recipient),
      formatAddress(collectionFormat, collection)
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
}
