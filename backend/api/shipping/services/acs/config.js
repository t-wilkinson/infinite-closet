const HOURS_IN_DAY = 24
const daysToHours = (days) => days * HOURS_IN_DAY

const publicConfig = {
  timing: {
    cutoff: 12,
    hoursSendCleaners: 1 * HOURS_IN_DAY,
    hoursToClean: 1 * HOURS_IN_DAY,
    completionBufferHours: 1 * HOURS_IN_DAY, // buffer some time for order completion in case anything goes wrong
  },

  rentalLengths: {
    short: (4 - 1) * HOURS_IN_DAY,
    long: (8 - 1) * HOURS_IN_DAY,
  },

  shippingClasses: {
    one: '24',
    two: '48',
  },

  shippingClassHours: (sent, shippingClass) => {
    // ACS does not operate on saturday(6) and sunday(0)
    let offset = 0
    if (sent.day() === 6) {
      offset += 2
    } else if (sent.day() === 0) {
      offset += 1
    }

    return {
      one: daysToHours(1 + offset),
      two: daysToHours(2 + offset),
    }[shippingClass]
  },

  // API expects specific address format
  // `formatAddress` maps database address to API format using these templates
  addressFormats: {
    recipient: {
      name: ['FirstName', 'LastName'],
      email: 'Email',
      phone: 'MobilePhone',
      address: ['Delivery_Address1', 'Delivery_Address2', 'Delivery_Address3'],
      town: 'Delivery_City',
      postcode: 'Delivery_Postcode',
      deliveryInstructions: 'Comment',
    },
  },
}

module.exports = {
  ...publicConfig,

  endpoint: {
    live: 'https://partnerapis.acsclothing.co.uk/api/v1',
    test: 'https://uat-partnerapis.acsclothing.co.uk/api/v1',
  },

  deliveryAgent: 'RM',

  auth: {
    accountCode: 'INFINITE',
    username: 'infinitecloset',
    password: 'UTz87asC3jnGrJnpXCkawWeZRcPQHFd3',
  },
}
