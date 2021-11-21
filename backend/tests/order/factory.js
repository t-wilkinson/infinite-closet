/**
 * Default data that factory use
 */
const defaultData = {
  status: 'cart',
  size: 'S',
  rentalLength: 'short',
}

/**
 * Returns a mock updated with given data
 */
const mock = (options = {}) => {
  return {
    ...defaultData,
    ...options,
  }
}

/**
 * Creates new product in strapi database, first calling mock() on `data`
 */
const create = async (strapi, data={}) => {
  return await strapi.query('order', 'orders').create(mock(data))
}

module.exports = {
  mock,
  create,
  defaultData,
}

