const defaultOrderData = {
  status: 'cart',
  size: 'MD',
  startDate: new Date().toJSON(),
  shippingDate: null,
  rentalLength: 'short',
  address: {
    fullName: 'First Last',
    addressLine1: 'Line 1',
    addressLien2: 'Line 2',
    town: 'Town',
    postcode: 'Postcode',
  },
  paymentMethod: null,
  paymentIntent: null,
  shipment: null,
  product: null,
  user: null,
  insurance: false,
  coupon: null,
  charge: null,
  fullName: 'First Last',
  nickName: 'Nick name',
  email: 'firstlast@example.com',
}

/**
 * @param {object} options that overwrites default options
 * @param {Date} options.startDate that overwrites default options
 * @param {string} options.size that overwrites default options
 * @param {string} options.rentalLength that overwrites default options
 * @returns {object} object that is used with `strapi.plugins["orders"].services.orders.create`
 */
const mockOrderData = (options = {}) => {
  return {
    ...defaultOrderData,
    ...options,
  }
}

/**
 * Creates new user in strapi database
 * @param strapi, instance of strapi
 * @param {object=} options that overwrites default options
 * @returns {object} object of new created user, fetched from database
 */
const createOrder = async (strapi, data) => {
  let options = Object.assign(mockOrderData(), data)

  return await strapi.plugins['orders'].services.order.create({
    ...options,
  })
}

module.exports = {
  mockOrderData,
  createOrder,
  defaultOrderData,
}
