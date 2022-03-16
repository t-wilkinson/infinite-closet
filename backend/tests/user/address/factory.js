/**
 * Default data that the factory uses
 */
const defaultData = {
  fullName: 'Full name',
  email: 'email',
  addressLine1: 'Address line 1',
  addressLine2: 'Address line 2',
  town: 'Town',
  postcode: 'Postcode',
  mobileNumber: 'Mobile number',
  deliveryInstructions: 'Delivery instructions',
}

/**
 * Returns random username object for user creation
 */
const mock = (options = {}) => {
  return {
    ...defaultData,
    ...options,
  }
}

/**
 * Creates new user in strapi database
 */
const create = async (strapi, data) => {
  return await strapi.query('address').create({
    ...mock(data),
  })
}

module.exports = {
  mock,
  create,
  defaultData,
}

