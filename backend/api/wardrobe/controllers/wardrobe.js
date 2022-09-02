'use strict'

const { toId } = require('../../../utils')

async function wardrobeFilters(_query, user) {
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

function paramsToArray(param) {
  if (Array.isArray(param)) {
    return param
  } else if (typeof param === 'string') {
    return [param]
  } else {
    return []
  }
}

/**
 * Prepare product data with paging and populating fields
 * @param {obj} paging
 * @param {number} paging.start
 * @param {number} paging.limit
 * @param {{id: string}[]} products
 */
function populateProducts(paging, products) {
  const start = paging.start
  const end = paging.start + paging.limit
  return Promise.all(
    products
      .slice(start, end)
      .map(({ id }) =>
        strapi.query('product').findOne({ id }, ['designer', 'images', 'sizes'])
      )
  )
}

async function queryWardrobes(user, query) {
  const knex = strapi.connections.default
  query = strapi.services.filter.buildQuery(query)
  const userId = toId(user)

  // Get product ids in a user's wardrobe
  let queryUser
  if (query.where.page === 'my-wardrobe') {
    if (!userId) {
      throw new Error('User not found')
    }
    queryUser = userId
  } else if (query.where.user) {
    queryUser = await strapi.query('user', 'users-permissions').findOne({ username: query.where.user }, [])
  }
  const productIds = await strapi.services.query_products.wardrobeItems(
    query,
    toId(queryUser),
    user
  )

  const [products, filters, categories, wardrobes] = await Promise.all([
    strapi.services.query_products.products(
      knex,
      query.where,
      query.paging,
      productIds,
      userId,
    ),
    strapi.services.query_products.filters(
      knex,
      query.where,
      productIds,
      userId,
    ),
    strapi.services.query_products.categories(query.where, productIds),
    wardrobeFilters(query, user),
  ])

  return {
    products: await populateProducts(query.paging, products),
    count: products.length,
    filters: {
      ...filters,
      wardrobes,
    },
    categories,
  }
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
  async searchWardrobes(ctx) {
    const res = await queryWardrobes(ctx.state.user, ctx.query)

    ctx.send({
      products: res.products,
      count: res.count,
      filters: res.filters,
      categories: res.categories,
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
    const wardrobeItem = await strapi.query('wardrobe-item').create({
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

  async searchWardrobe(ctx) {
    const knex = strapi.connections.default
    const { tags, search } = ctx.query
    const wardrobes = await strapi.services.wardrobe.queryWardrobes({
      knex,
      search,
      tags: paramsToArray(tags),
    })

    // fetch products from each wardrobe
    const data = await Promise.all(
      wardrobes.map(async (wardrobe) => {
        let wardrobeItems = await strapi
          .query('wardrobe-item')
          .find({ wardrobe: toId(wardrobe.id), _limit: 10 }, [])
        const productIds = [
          ...wardrobeItems.reduce((acc, { product }) => {
            acc.add(product)
            return acc
          }, new Set()),
        ]
        const products = await Promise.all(
          productIds.map((id) =>
            strapi.query('product').findOne({ id }, ['images', 'designer'])
          )
        )
        return {
          wardrobe,
          products: products.filter((product) => product),
        }
      })
    )
    ctx.send(data)
  },

  async updateWardrobe(ctx) {
    const user = ctx.state.user
    const { id } = ctx.params

    const body = ctx.request.body
    const wardrobe = await strapi.query('wardrobe').findOne({ id }, ['tags'])
    if (!wardrobe) {
      return ctx.badRequest('Wardrobe not found')
    }
    if (wardrobe.user !== user.id) {
      return ctx.unauthorized('You don\'t own this wardrobe')
    }

    const props = {}

    if (body.name && body.name !== wardrobe.name) {
      props.name = body.name
    }
    if (body.description && body.description !== wardrobe.description) {
      props.description = body.description
    }
    if (body.visible && !!body.visible !== !!wardrobe.visible) {
      props.visible = !!body.visible
    }

    const bodyTags = new Set(body.tags)
    if (body.tags && (body.tags.length !== wardrobe.tags.length || !wardrobe.tags.every(tag => bodyTags.has(tag)))) {
      const tags = await Promise.all(body.tags.map(tag => strapi.query('wardrobe-tag').create({name: tag})))
      props.tags = tags.map(tag => tag.id)
    }

    const createdWardrobe = await strapi.query('wardrobe').update({ id }, props)
    ctx.send(createdWardrobe)
  },

  // async getWardrobeData(ctx) {
  //   const { slug } = ctx.params
  //   const wardrobe = await strapi.query('wardrobe').findOne({
  //     slug,
  //   }, [])
  //   if (!wardrobe) {
  //     return ctx.badRequest('Wardrobe does not exist')
  //   }

  //   const wardrobeItems = await strapi
  //     .query('wardrobe-item')
  //     .find({ wardrobe: toId(wardrobe) }, [])
  //   const productIds = [...wardrobeItems.reduce((acc, {product}) => {
  //     acc.add(product)
  //     return acc
  //   } , new Set())]
  //   const products = await Promise.all(
  //     productIds.map((id) =>
  //       strapi
  //         .query('product')
  //         .findOne({ id }, ['images', 'designer'])
  //     )
  //   )
  //   ctx.send({
  //     wardrobe,
  //     products: products.filter((product) => product),
  //   })
  // },
}
