/**
 * @file Searches for products in database based on query filters.
 * The main function is {@link query} which returns products, available filters to further modify search by,
 * and categories (primarily for breadcrumb list).
 */

'use strict'
const models = require('../../../data/data.js').models

// Assigns default value to new keys
class DefaultDict {
  constructor(defaultInit) {
    return new Proxy(
      {},
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : (target[name] =
                typeof defaultInit === 'function'
                  ? new defaultInit().valueOf()
                  : defaultInit),
      }
    )
  }
}

function partitionObject(object, predicate) {
  return Object.entries(object).reduce(
    ([left, right], item) => {
      if (predicate(item[0])) {
        left[item[0]] = item[1]
      } else {
        right[item[0]] = item[1]
      }
      return [left, right]
    },
    [{}, {}]
  )
}

/**
 * Search for products in database matching `_where`
 */
async function findProducts(knex, _where, _paging) {
  // TODO: handle paging in SQL
  let sort = _paging.sort.split(':')
  sort[0] = `products."${sort[0]}"`
  sort = sort.join(' ')
  const productIds = await knex
    .select('products.id as id')
    .from('products')
    .join('designers', 'products.designer', 'designers.id')
    .orderByRaw(sort)
    .whereNotNull('products.published_at')
    .whereRaw(...strapi.services.product.toRawSQL(_where))

  const products = await Promise.all(
    productIds.map(({ id }) =>
      strapi.query('product').findOne({ id }, ['designer', 'images', 'sizes'])
    )
  )
  return products
}

/**
 * Extracts unique slugs from each product filter
 * to show user only options that will actually affect search results.
 * @param {Object[]} products
 */
function productSlugs(products) {
  let filterSlugs = new DefaultDict(Set)
  for (const product of products) {
    for (const filter of strapi.services.product.filterSlugs) {
      if (filter in models) {
        const slugs = product[strapi.services.product.toPrivateFilter(filter)]
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

async function queryFilters(knex, _where) {
  // here we find all filters in products under only the category filter
  const products = await knex
    .select('products.*')
    .from('products')
    .whereNotNull('products.published_at')
    .whereRaw(...strapi.services.product.toRawSQL({ categories: _where.categories }))

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

const DEFAULT_PAGE_NUMBER = 0
const DEFAULT_PAGE_SIZE = 20

module.exports = {
  // TODO: there are plenty of ways to speed this up when it bottlenecks
  async query(ctx) {
    const query = ctx.query
    const [_paging, _where] = partitionObject(query, (k) =>
      ['start', 'limit', 'sort'].includes(k)
    )

    const knex = strapi.connections.default
    const [products, filters, categories] = await Promise.all([
      findProducts(knex, _where, _paging),
      queryFilters(knex, _where),
      queryCategories(_where),
    ])

    const start = parseInt(_paging.start) || DEFAULT_PAGE_NUMBER
    const limit = parseInt(_paging.limit) || DEFAULT_PAGE_SIZE
    const end = start + limit

    ctx.send({
      products: products.slice(start, end),
      count: products.length,
      filters,
      categories,
    })
  },
}
