'use strict'
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')

// TODO: might not need this
const generateAPI = (name, plugin = '') => {
  return {
    async find(ctx) {
      let entities
      if (ctx.query._q) {
        entities = await strapi.query(name, plugin).search(ctx.query)
      } else {
        entities = await strapi.query(name, plugin).find(ctx.query)
      }
      return entities.map((entity) =>
        sanitizeEntity(entity, { model: strapi.query(name, plugin).model })
      )
    },

    async count(ctx) {
      if (ctx.query._q) {
        return await strapi.query(name, plugin).countSearch(ctx.query)
      }
      return strapi.query(name, plugin).count(ctx.query)
    },

    async create(ctx) {
      let entity
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx)
        entity = await strapi.query(name, plugin).create(data, { files })
      } else {
        entity = await strapi.query(name, plugin).create(ctx.request.body)
      }
      return sanitizeEntity(entity, {
        model: strapi.query(name, plugin).model,
      })
    },

    async update(ctx) {
      const { id } = ctx.params

      let entity
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx)
        entity = await strapi.query(name, plugin).update({ id }, data, {
          files,
        })
      } else {
        entity = await strapi
          .query(name, plugin)
          .update({ id }, ctx.request.body)
      }

      return sanitizeEntity(entity, {
        model: strapi.query(name, plugin).model,
      })
    },

    async delete(ctx) {
      const { id } = ctx.params

      const entity = await strapi.query(name, plugin).delete({ id })
      return sanitizeEntity(entity, {
        model: strapi.query(name, plugin).model,
      })
    },

    async findOne(ctx) {
      const { id } = ctx.params

      const entity = await strapi.query(name, plugin).findOne({ id })
      return sanitizeEntity(entity, {
        model: strapi.query(name, plugin).model,
      })
    },
  }
}

module.exports = {
  generateAPI,
}
