const mockProduct = require('../__mocks__/product')

const defaultData = {
  status: 'cart',
  rentalLength: 'short',
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
    product: mockProduct,
    ...defaultData,
    ...options,
  }
}

/**
 * Creates new user in strapi database
 * @param strapi, instance of strapi
 * @param {object} options that overwrites default options
 * @returns {object} object of new created user, fetched from database
 */
const createOrder = async (strapi, data) => {
  let options = {}
  Object.assign(options, mockOrderData(), data)
  return await strapi.plugins['orders'].services.order.create({
    ...options,
  })
}

module.exports = {
  mockOrderData,
  createOrder,
  defaultData,
}