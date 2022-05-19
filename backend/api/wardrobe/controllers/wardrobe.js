'use strict'

const { toId } = require('../../../utils')

async function wardrobeFilters(query, user) {
  const wardrobes = await strapi.query('wardrobe').find(
    {
      user: toId(user.id),
    },
    []
  )

  return [
    ...wardrobes,
    // Custom wardrobe filters
    { name: 'My wardrobe', slug: 'my-wardrobe' },
    { name: 'Favorites', slug: 'favorites' },
    { name: 'Previously rented', slug: 'previously-rented' },
  ]
}

module.exports = {
  async productWardrobes(ctx) {
    const user = ctx.state.user
    const { product_id } = ctx.params
    const wardrobes = await strapi.query('wardrobe').find({ user: toId(user) })
    const wardrobeItems = await strapi
      .query('wardrobe-item')
      .find({ user: toId(user), product: product_id })

    ctx.send({
      wardrobes: [...wardrobes, { name: 'My wardrobe', slug: 'my-wardrobe' }],
      wardrobeItems,
    })
  },

  // Handles logic related to filtering products based on wardrobe filters, etc.
  async query(ctx) {
    const user = ctx.state.user

    const knex = strapi.connections.default
    const query = strapi.services.filter.buildQuery(ctx.query)
    const productIds = await strapi.services.query_products.wardrobeItems(
      query,
      user
    )

    const [products, filters, categories, wardrobes] = await Promise.all([
      strapi.services.query_products.products(
        knex,
        query.where,
        query.paging,
        productIds
      ),
      strapi.services.query_products.filters(knex, query.where, productIds),
      strapi.services.query_products.categories(query.where, productIds),
      wardrobeFilters(query, user),
    ])

    // Prepare product data with paging and populating fields
    const start = query.paging.start
    const end = query.paging.start + query.paging.limit
    const populatedProducts = await Promise.all(
      products
        .slice(start, end)
        .map(({ id }) =>
          strapi
            .query('product')
            .findOne({ id }, ['designer', 'images', 'sizes'])
        )
    )

    ctx.send({
      products: populatedProducts,
      count: products.length,
      filters: {
        ...filters,
        wardrobes,
      },
      categories,
    })
  },

  async addWardrobe(ctx) {
    const user = ctx.state.user
    const { name } = ctx.request.body
    const slug = name
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')

    const wardrobes = await strapi
      .query('wardrobe')
      .find({ slug, user: toId(user) })
    if (wardrobes.length > 0) {
      return ctx.badRequest('Wardrobe already exists')
    } else {
      const wardrobe = await strapi
        .query('wardrobe')
        .create({ name, slug, user: toId(user) })
      return ctx.send(wardrobe)
    }
  },

  async removeWardrobe(ctx) {
    const user = ctx.state.user
    const { slug } = ctx.params
    if (!slug) {
      return ctx.badRequest('Wardrobe does not exist')
    }
    await strapi.query('wardrobe').delete({ slug, user: toId(user) })
    ctx.send()
  },

  async createItem(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body
    const wardrobeItem = await strapi
      .query('wardrobe-item')
      .create({
        user: toId(user),
        wardrobe: body.wardrobeId || null,
        product: body.productId,
      })
    ctx.send(wardrobeItem)
  },

  async deleteItem(ctx) {
    const user = ctx.state.user
    const { item_id } = ctx.params

    await strapi
      .query('wardrobe-item')
      .delete({ user: toId(user), id: item_id })
    ctx.send()
  },
}
