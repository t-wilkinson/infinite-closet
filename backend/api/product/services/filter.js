/**
 * @file Filter products by query filters for products page
 */
'use strict'
const _ = require('lodash')

/**
 * Some product filters contain a private hash of values to speed up searching
 */
const toPrivateFilter = (key) => key + '_'

const filterSlugs = [
  'designers',
  'fits',
  'colors',
  'occasions',
  'weather',
  'categories',
  'styles',
  'sizes',
  'materials',
  'metals',
]

/**
 * Builds SQL queries for filtering products
 */
class SQLQueryBuilder {
  constructor(logic = 'OR') {
    this.values = [] // values to substitute into query
    this.query = [] // forms query like `?? like ?`
    this.logic = logic
  }

  addSlug(filter, slug) {
    if (filter === 'designers') {
      this.values.push('designers.slug')
    } else {
      this.values.push(toPrivateFilter(filter))
    }
    this.values.push(`%${slug}%`)
  }

  add(filter, slugs) {
    if (typeof slugs === 'string') {
      slugs = [slugs]
      this.addSlug(filter, slugs)
      this.query.push('?? like ?')
    } else {
      // Build a sub-query
      const logic = filter === 'categories' ? 'AND' : 'OR'
      const subQuery = new SQLQueryBuilder(logic)

      for (const slug of slugs) {
        subQuery.add(filter, slug)
      }

      const [query, values] = subQuery.complete()
      this.query.push(query)
      this.values = this.values.concat(values)
    }
  }

  join() {
    return `( ${this.query.join(' ' + this.logic + ' ')} )`
  }

  complete() {
    return [this.join(), this.values]
  }
}

const toRawSQL = (_where) => {
  const _filterSlugs = _.pick(_where, filterSlugs)
  let query = new SQLQueryBuilder('AND')

  // We to form a query as follows (notice we AND category filters but OR all others):
  // (category1 AND ...) AND (color1 OR ...) AND (occasion1 OR ...) AND ...
  for (const [filter, slugs] of Object.entries(_filterSlugs)) {
    query.add(filter, slugs)
  }

  return query.complete()
}


module.exports = {
  filterSlugs,
  toPrivateFilter,
  toRawSQL,
}
