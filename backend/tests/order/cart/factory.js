const f = {}
f.order = require('../factory')

/**
 * Creates new product in strapi database, first calling mock() on `data`
 */
const create = async (strapi, orders) => {
  orders = await Promise.all(orders.map(order => f.order.create(strapi, order)))
  return await strapi.plugins['orders'].services.cart.create(orders)
}

module.exports = {
  create,
}
