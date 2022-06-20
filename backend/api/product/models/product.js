'use strict'

const _ = require('lodash')
const { toId } = require('../../../utils')
const models = require('../../../data/data.js').models

async function addHiddenFields(data) {
  // Don't allow modifying hidden `model` fields
  _.omit(
    data,
    Object.keys(models).map((v) => `${v}_`)
  )

  for (const [filter, model] of Object.entries(models)) {
    if (!(filter in data)) {
      continue
    }

    if (filter === 'sizes') {
      const sizes = await strapi
        .query('custom.sizes')
        .find({ id_in: data[filter].map((v) => v.id).filter((id) => id) })
      let slugs = new Set()

      for (const size of sizes) {
        for (const value of strapi.services.size.sizes(size)) {
          slugs.add(value)
        }
      }

      slugs = Array.from(slugs).join(',')
      data[`${filter}_`] = slugs
    } else if (filter in data) {
      const values = await strapi
        .query(model)
        .find({ id_in: data[filter].map(toId).filter((id) => id) })
      const slugs = values.map((v) => v.slug).join(',')
      data[`${filter}_`] = slugs
    }
  }
}

module.exports = {
  lifecycles: {
    async beforeUpdate(_params, data) {
      await addHiddenFields(data)
    },
    async beforeCreate(data) {
      await addHiddenFields(data)
    },
  },
}
