/**
 * @file Searches for products in database based on query filters.
 * The main function is {@link query} which returns products, available filters to further modify search by,
 * and categories (primarily for breadcrumb list).
 */
'use strict'

module.exports = {
  async query(ctx) {
    const knex = strapi.connections.default
    const query = strapi.services.filter.buildQuery(ctx.query)

    const [products, filters, categories] = await Promise.all([
      strapi.services.query_products.products(knex, query.where, query.paging),
      strapi.services.query_products.filters(knex, query.where),
      strapi.services.query_products.categories(query.where),
    ])

    const start = query.paging.start
    const end = query.paging.start + query.paging.limit
    const populatedProducts = await Promise.all(products.slice(start, end)
      .map(({ id }) =>
        strapi.query('product').findOne({ id }, ['designer', 'images', 'sizes'])
      )
    )

    ctx.send({
      products: populatedProducts,
      count: products.length,
      filters,
      categories,
    })
  },
}
