'use strict'
const HOURS_IN_DAY = 24

module.exports = {
  parcels: 'https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels',
  postcodes: 'https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes',
  key: 'keyzCmMhMH9fvKBPV',
  timing: {
    cutoff: 12,
    hoursToClean: 1 * HOURS_IN_DAY, // oxwash takes 24 hours to clean
    hoursSendCleaners: 2 * HOURS_IN_DAY, // 2 day shipping
    completionBufferHours: 1 * HOURS_IN_DAY, // buffer some time for order completion in case anything goes wrong
  },
  rentalLengths: {
    short: (4 - 1) * HOURS_IN_DAY,
    long: (8 - 1) * HOURS_IN_DAY,
  },
  shippingClasses: {
    // zero: 'Same-Day',
    one: 'Next-Day',
    two: '2-Days',
  },
  shippingClassesHours: {
    // first and last day of the rental are 12 hours each, so subtract a day
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
  addressFormats: {
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
