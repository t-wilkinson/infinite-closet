const f = {}
f.product = require('../product/factory')
f.user = require('../user/factory')

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
const create = async (strapi, data = {}) => {
  let options = {}
  if (data.user === undefined) {
    const user = await f.user.create(strapi)
    options.user = user.id
  }
  if (data.product === undefined) {
    const product = await f.product.create(strapi)
    options.product = product.id
  }
  const orderData = mock({ ...data, ...options })
  return await strapi.query('order', 'orders').create(orderData)
}

module.exports = {
  mock,
  create,
  defaultData,
}
