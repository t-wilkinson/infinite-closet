'use strict'
const { toId } = require('../../../utils')

async function searchWardrobe(ctx) {
  try {
    const wardrobe = await strapi.query('order', 'orders').find({
      status: 'list',
    })

    // Filter products in wardrobe
    const knex = strapi.connections.default
    const query = strapi.services.filter.buildQuery(ctx.query)
    const productIds = await strapi.services.filter.filterProducts(knex, query.where, query.paging, wardrobe.map(order => toId(order.product)))

    const populatedProducts = await Promise.all(
      productIds.map(({ id }) =>
        strapi.query('product').findOne({ id }, ['designer', 'images', 'sizes'])
      )
    )

    ctx.send(populatedProducts)
  } catch (e) {
    strapi.log.error('failure searching wardrobe', e.stack, e.message)
  }
  ctx.send()
}

module.exports = {
  searchWardrobe,
}
