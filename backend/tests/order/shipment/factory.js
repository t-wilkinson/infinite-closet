const { day } = require('../../../utils')

const defaultData = {
  shippingStatus: 'normal',
  shippingClass: 'two',
  status: 'confirmed',
  confirmed: day().toJSON(),
}

const mock = (options={}) => {
  return {
    ...defaultData,
    ...options,
  }
}

const create = async (strapi, data = {}) => {
  return await strapi.query('shipment').create(mock(data))
}

module.exports = {
  create,
  mock,
  defaultData,
}
