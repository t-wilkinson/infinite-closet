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

/**
 * Query wardrobes using SQL (should be more efficient)
 */
async function searchWardrobesSQL({ knex, tags, search }) {
  // const searchParams = search ? search.replace(/'/g, "''").split(' ') : []
  // const wardrobeName =
  //   searchParams.length > 0
  //     ? `wardrobes.name ~* '${searchParams.join('|')}'`
  //     : ''
  // const wardrobeTags =
  //   tags.length > 0
  //     ? `wardrobe_tags.name ~* '${tags.join('|')}'`
  //     : ''
  // const orFilters = [wardrobeName, wardrobeTags].filter(Boolean).join(' OR ') || 'true'
  // console.log(orFilters)

  // const wardrobeIds = await knex
  //   .select('wardrobes.id as id')
  //   .from('wardrobes')
  //   .leftOuterJoin('wardrobe_tags', 'wardrobe_tags.wardrobe', 'wardrobes.id')
  //   .whereRaw(orFilters)
  // const wardrobes = await strapi
  //   .query('wardrobe')
  //   .find({ id_in: wardrobeIds.map((w) => w.id) }, ['user', 'tags'])
  // return wardrobes
}

async function filterWardrobes(user, query) {
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
    queryUser = await strapi
      .query('user', 'users-permissions')
      .findOne({ username: query.where.user }, [])
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
      userId
    ),
    strapi.services.query_products.filters(
      knex,
      query.where,
      productIds,
      userId
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

function searchWardrobes({ tags, search, wardrobes }) {
  const searchParams = search ? search.split(' ').filter(p => p).map(p => p.toLowerCase()) : []
  tags = tags.map(tag => tag.toLowerCase())

  return wardrobes.filter((wardrobe) => {
    const name = (wardrobe.name || '').toLowerCase()
    const description = (wardrobe.description || '').toLowerCase()
    const username = (wardrobe.user?.username || '').toLowerCase()
    // Does any text in the search match the wardrobe information?
    const searchMatches = searchParams.every((param) => {
      const hasName = name.includes(param)
      const hasDescription = description.includes(param)
      const hasUser = username.includes(param)
      return hasName || hasDescription || hasUser
    })
    const tagsMatch = tags
      ? tags.every((tag) => wardrobe.tags.some(({ name }) => tag === name.toLowerCase()))
      : true
    return searchMatches && tagsMatch
  })
}

module.exports = {
  searchWardrobes,
  filterWardrobes,
}
