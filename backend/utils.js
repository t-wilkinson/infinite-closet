'use strict'
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')

const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
const isBetween = require('dayjs/plugin/isBetween')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
const objectSupport = require('dayjs/plugin/objectSupport')

require('dayjs/locale/en-gb')

dayjs.extend(duration)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(objectSupport)
dayjs.extend(isSameOrBefore)

dayjs.locale('en-gb')
dayjs.tz.setDefault('Europe/London')
// dayjs has some odd effects so we must:
//  check if a date is already a dayjs object
//  change dayjs objects to utc before comparing

/**
 * Use same timezone for all dates for more predictable and reliable behavior
 * @param {DateLike} date - Returns dayjs object in Europe/London timezone
 */
function day(date) {
  if (dayjs.isDayjs(date)) {
    return date
  } else {
    return dayjs.tz(date)
  }
}

// Split name into first and last name
function splitName(name) {
  if (!name || typeof name !== 'string') {
    return { firstName: null, lastName: null }
  }

  const [first, ...last] = name.split(/ /) // Don't split `Dr.`, etc.
  return { firstName: first || null, lastName: last.join(' ') || null }
}

/**
 * Objects from strapi.query either have nested relation objects or just their ids
 */
function toId(obj) {
  return obj?.id || obj
}

/**
 * If represents an id, retrieves corresponding object from id
 * otherwise return the object
 */
async function fromId(data, name, plugin) {
  if (typeof data === 'object') {
    return data
  }
  return await strapi.query(name, plugin).findOne({id: data})
}

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
  toId,
  fromId,
  generateAPI,
  splitName,
  day,
}
