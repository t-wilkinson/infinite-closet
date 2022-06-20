const { toId, DefaultDict } = require('../../../utils')
const models = require('../../../data/data.js').models

async function whereIn(column, ids, knexQuery) {
  if (ids) {
    return knexQuery.whereIn(column, ids)
  } else {
    return knexQuery
  }
}

/**
 * Search for products in database matching `_where`
 */
async function queryProducts(knex, _where, _paging, ids, user=null) {
  let sort = _paging.sort.split(':')
  sort[0] = `products."${sort[0]}"`
  sort = sort.join(' ')

  let productIds
  if (user) {
    productIds = await whereIn('products.id', ids, knex
      .select('products.id as id')
      .from('products')
      .join('designers', 'products.designer', 'designers.id')
      .orderByRaw(sort)
      .where('products.user', user)
      .orWhereNull('products.user')
      .whereNotNull('products.published_at')
      .whereRaw(...strapi.services.filter.toRawSQL(_where))
    )
  } else {
    productIds = await whereIn('products.id', ids, knex
      .select('products.id as id')
      .from('products')
      .join('designers', 'products.designer', 'designers.id')
      .orderByRaw(sort)
      .whereNull('products.user')
      .whereNotNull('products.published_at')
      .whereRaw(...strapi.services.filter.toRawSQL(_where))
    )
  }

  const populatedProducts = await Promise.all(
    productIds.map(({ id }) =>
      strapi.query('product').findOne({ id }, ['designer', 'images', 'sizes'])
    )
  )
  return populatedProducts
}

async function availableSizes(knex, slugs) {
  // prettier-ignore
  const sizes = await knex
    .select('components_custom_sizes.* as sizes')
    .from('components_custom_sizes')
    .distinctOn('components_custom_sizes.size')
    .whereRaw(
      Array(slugs.size).fill('components_custom_sizes.size = ?').join(' OR '),
      Array.from(slugs)
    )

  const sizeRanges = sizes.reduce((acc, size) => {
    for (const value of strapi.services.size.sizes(size)) {
      acc.add(value)
    }
    return acc
  }, new Set())

  return Array.from(sizeRanges)
}

/**
 * Extracts unique slugs from each product filter
 * to show user only options that will actually affect search results.
 * @param {Object[]} products
 */
function productSlugs(products) {
  let filterSlugs = new DefaultDict(Set)
  for (const product of products) {
    for (const filter of strapi.services.filter.filterSlugs) {
      if (filter in models) {
        const slugs = product[strapi.services.filter.toPrivateFilter(filter)]
        if (!slugs) {
          continue
        }
        for (const slug of slugs.split(',')) {
          filterSlugs[filter].add(slug)
        }
      } else if (filter === 'designers') {
        filterSlugs[filter].add(product.designer)
      } else {
        filterSlugs[filter].add(product[filter])
      }
    }
  }
  return filterSlugs
}

async function queryFilters(knex, _where, ids, user=null) {
  // here we find all filters in products under only the category filter
  const products = await whereIn('products.id', ids, knex
    .select('products.*')
    .from('products')
    .where('products.user', user)
    .orWhereNull('products.user')
    .whereNotNull('products.published_at')
    .whereRaw(
      ...strapi.services.filter.toRawSQL({ categories: _where.categories })
    ))

  // slugs contain only filters that match product categories
  // get all filters that match these slugs
  let filters = new DefaultDict({})
  for (const [filter, slugs] of Object.entries(productSlugs(products))) {
    if (filter in models) {
      if (filter === 'sizes') {
        filters[filter] = await availableSizes(knex, slugs)
      } else {
        filters[filter] = await knex
          .select(`${filter}.*`)
          .distinct(`${filter}.id`)
          .from(filter)
          .whereRaw(
            Array(slugs.size).fill(`${filter}.slug = ?`).join(' OR '),
            Array.from(slugs)
          )
      }
    } else if (filter === 'designers') {
      // prettier-ignore
      filters[filter] = await knex
        .select(`${filter}.*`)
        .from(filter)
        .whereRaw(
          Array(slugs.size).fill(`${filter}.id = ?`).join(' OR '),
          Array.from(slugs)
        )
    } else {
      strapi.log.warn(
        'controllers:product:query: the query query for %s is not implemented',
        filter
      )
    }
  }

  return filters
}

async function queryCategories(_where) {
  const filterCategories =
    typeof _where.categories === 'string'
      ? [_where.categories]
      : _where.categories
  const unorderedCategories = await strapi.query('category').find({
    slug_in: filterCategories,
  })

  let categories = []
  for (const slug of filterCategories) {
    category: for (const category of unorderedCategories) {
      if (slug === category.slug) {
        categories.push(category)
        break category
      }
    }
  }
  return categories
}

const CUSTOM_WARDROBES = ['my-wardrobe', 'favorites', 'previously-rented']

function extendWardrobes(query) {
  if (query.wardrobes.length === 0) {
    return CUSTOM_WARDROBES
  } else {
    return query.wardrobes
  }
}

/**
 * Find product ids that are in the users wardrobe query for further querying
 */
async function queryWardrobeItems(query, user) {
  const wardrobeItems = await strapi.query('wardrobe-item').find({
    ...(query.wardrobes.length === 0 ? {} : { 'wardrobe.slug_in': query.wardrobes }),
    user: toId(user),
  }, [])
  let productIds = wardrobeItems.map(wardrobeItem => wardrobeItem.product)

  // Some wardrobes require custom logic to get dynamically generated
  for (const wardrobe of extendWardrobes(query)) {
    if (wardrobe === 'previously-rented') {
      const orders = await strapi.query('order', 'orders').find({ user: toId(user), status: 'completed' }, [])
      productIds.push.apply(productIds, orders.map(order => order.product))
    } else if (wardrobe === 'favorites') {
      const orders = await strapi.query('order', 'orders').find({ user: toId(user), status: 'list' }, [])
      productIds.push.apply(productIds, orders.map(order => order.product))
    } else if (wardrobe === 'my-wardrobe') {
      // Items are assigned to the 'My wardrobe' wardrobe by setting wardrobe to null
      const wardrobeItems = await strapi.query('wardrobe-item').find({ user: toId(user), wardrobe: null }, [])
      productIds.push.apply(productIds, wardrobeItems.map(order => order.product))
    }
  }

  return productIds
}

module.exports = {
  products: queryProducts,
  filters: queryFilters,
  categories: queryCategories,
  wardrobeItems: queryWardrobeItems,
}
