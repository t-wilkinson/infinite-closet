const _ = require('lodash')
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

const partitionObject = (object, predicate) =>
  Object.entries(object).reduce(
    ([left, right], item) => {
      if (predicate(item)) {
        left[item[0]] = item[1]
      } else {
        right[item[0]] = item[1]
      }
      return [left, right]
    },
    [{}, {}]
  )

const productFilters = [
  'designers',
  'fits',
  'colors',
  'occasions',
  'weather',
  'categories',
  'styles',
  'sizes',
]

// Some product filters contain a private hash of values to speed up searching
const toPrivate = (key) => key + '_'

// Convert _where query params to raw SQL query
const toRawSQL = (_where) => {
  const filterSlugs = _.pick(_where, productFilters)
  let values = []
  let query = []

  const addSlug = (filter, slug) => {
    if (filter === 'designers') {
      values.push('designers.slug')
    } else {
      values.push(toPrivate(filter))
    }
    values.push(`%${slug}%`)
  }

  // we to form a query as follows (notice we AND category filters but OR all others):
  // (category1 AND ...) AND (color1 OR ...) AND (occasion1 OR ...) AND ...
  for (const [filter, slugs] of Object.entries(filterSlugs)) {
    // slugs is either a single string or list of strings
    if (typeof slugs === 'string') {
      addSlug(filter, slugs)
      query.push('?? like ?')
    } else {
      const q = []
      for (const slug of slugs) {
        addSlug(filter, slug)
        q.push('?? like ?')
      }

      // The `categories` filter should be ANDed together, all other filters are OR
      if (filter === 'categories') {
        query.push(q.join(' AND '))
      } else {
        query.push('( ' + q.join(' OR ') + ' )')
      }
    }
  }

  return [query.join(' AND '), values]
}

async function queryProducts(knex, _where, _paging) {
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
    .whereRaw(...toRawSQL(_where))

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
  /* TODO: don't show filters that would result in 0 products showing up
   * for each filter, show slugs that would match at least one product, given all the other filters
   * product holds the key information to solve this
   * how do we structure filter relations to ensure this?
   */
  let filterSlugs = new DefaultDict(Set)
  for (const product of products) {
    for (const filter of productFilters) {
      if (filter in models) {
        const slugs = product[toPrivate(filter)]
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
    if (size.sizeRange) {
      for (const value of strapi.services.size.range(size)) {
        acc.add(value)
      }
    } else {
      acc.add(size.size)
    }
    return acc
  }, new Set())

  return Array.from(sizeRanges).map(strapi.services.size.normalize)
}

async function queryFilters(knex, _where) {
  // here we find all filters in products under only the category filter
  const products = await knex
    .select('products.*')
    .from('products')
    .whereNotNull('products.published_at')
    .whereRaw(...toRawSQL({ categories: _where.categories }))

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

async function queryCategories(query) {
  const queryCategories =
    typeof query.categories === 'string'
      ? [query.categories]
      : query.categories
  const unorderedCategories = await strapi.query('category').find({
    slug_in: query.categories,
  })
  let categories = []
  for (const slug of queryCategories) {
    category: for (const category of unorderedCategories) {
      if (slug === category.slug) {
        categories.push(category)
        break category
      }
    }
  }
  return categories
}

const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 20

module.exports = {
  async facebookCatalog(ctx) {
    function toCSVRow(row) {
      return Object.values(row)
        .map((v) =>
          v === undefined || v === null
            ? '""'
            : `"${v
              .toString()
              .trim()
              .replace(/\n/g, '\t')
              .replace(/"/g, '""')}"`
        )
        .join(',')
    }

    const columns = [
      'id',
      'item_group_ID',
      'google_product_category',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
      'additional_image_link',
      'color',
      'gender',
      'size',
      'age_group',
    ]

    function toRow(product, size, quantity) {
      return {
        id: `${product.id}_${size}`,
        item_group_ID: product.id,
        google_product_category: 'Clothing & Accessories > Clothing > Dresses',
        title: product.name,
        description: `${product.details ? product.details + '.\n' : ''}Rent ${
          product.name
        } by ${product.designer.name} for only £${
          product.shortRentalPrice
        } at Infinite Closet`,
        availability: quantity > 0 ? 'in stock' : 'available for order',
        condition: 'used',
        price: product.shortRentalPrice + ' GBP',
        link: `https://${process.env.FRONTEND_DOMAIN}/shop/${product.designer.slug}/${product.slug}`,
        image_link: `https://${process.env.BACKEND_DOMAIN}${product.images[0].url}`,
        brand: product.designer.name,
        additional_image_link: product.images
          .slice(1)
          .map((image) => `https://${process.env.BACKEND_DOMAIN}${image.url}`)
          .join(','),
        color: product.colors[0] && product.colors[0].name,
        gender: 'female',
        size: size,
        age_group: 'adult',
      }
    }

    const products = await strapi
      .query('product')
      .find({ published_at_null: false }, [
        'designer',
        'colors',
        'images',
        'sizes',
      ])

    let rows = new Set()
    for (const product of products) {
      // Each product variant such as different size should be considered seperate
      for (const size of product.sizes) {
        for (const sizeItem of strapi.services.size.range(size)) {
          try {
            const row = toRow(
              product,
              strapi.services.size.normalize(sizeItem),
              size.quantity
            )
            rows.add(toCSVRow(row))
          } catch (e) {
            strapi.log.error('facebook-catalog %o', e)
          }
        }
      }
    }

    ctx.set({
      'Content-Disposition': 'attachment; filename="facebook-catalog.csv"',
      'Content-Type': 'text/csv; charset=utf-8',
    })

    rows = [toCSVRow(columns), ...rows]
    ctx.send(rows.join('\n'))
  },

  // TODO: there are plenty of ways to speed this up *when* it bottlenecks
  async query(ctx) {
    const query = ctx.query

    const [_paging, _where] = partitionObject(query, ([k]) =>
      ['start', 'limit', 'sort'].includes(k)
    )

    // TODO: can be sped up by a lot. use the results of `queryProducts` for the other two
    const knex = strapi.connections.default
    const [products, filters, categories] = await Promise.all([
      queryProducts(knex, _where, _paging),
      queryFilters(knex, _where),
      queryCategories(query),
    ])

    const start = parseInt(_paging.start) || DEFAULT_PAGE
    const limit = parseInt(_paging.limit) || DEFAULT_PAGE_SIZE
    const end = start + limit

    ctx.send({
      products: products.slice(start, end),
      count: products.length,
      filters,
      categories,
    })
  },

  async routes(ctx) {
    const categories = await strapi.query('category').find({
      slug_in: ['clothing'],
    })

    let routes = {}
    for (const category of categories) {
      routes[category.slug] = category
    }

    const occasions = await strapi.query('occasion').find({})

    ctx.send({
      routes,
      occasions,
    })
  },

  async shopItem(ctx) {
    const slug = ctx.params.slug
    const product = await strapi
      .query('product')
      .findOne({ published_at_null: false, slug })

    for (const [key, size] of Object.entries(product.sizes)) {
      product.sizes[key].size = strapi.services.size.normalize(size.size)
    }

    ctx.send(product)
  },
}
