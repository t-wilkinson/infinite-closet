const { day } = require('../../utils')
const f = {}
f.product = require('../product/factory')
f.user = require('../user/factory')
f.shipment = require('./shipment/factory')

/**
 * Default data that factory use
 */
const defaultData = {
  status: 'cart',
  size: 'S',
  rentalLength: 'short',
  expectedStart: day().add(3, 'day').toJSON(),
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
  if (data.shipment?.id === undefined) {
    const shipment = await f.shipment.create(strapi, data.shipment)
    options.shipment = shipment.id
  }
  const orderData = mock({ ...data, ...options })
  return await strapi.query('order', 'orders').create(orderData)
}

module.exports = {
  mock,
  create,
  defaultData,
}
