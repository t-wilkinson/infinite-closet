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
  if (!date) {
    return dayjs.tz()
  } else if (dayjs.isDayjs(date)) {
    return date
  } else {
    return dayjs.tz(date)
  }
}

function toFullName({ firstName, lastName }) {
  return [firstName, lastName].join(' ').trim()
}

// Split name into first and last name
function splitName(name) {
  if (!name || typeof name !== 'string') {
    return { firstName: '', lastName: '' }
  }

  const [first, ...last] = name.split(/ /) // Don't split `Dr.`, etc.
  return { firstName: first || '', lastName: last.join(' ') || '' }
}

/**
 * Objects from strapi.query either have nested relation objects or just their ids
 */
function toId(obj) {
  return obj?.id || obj
}

// /**
//  * If represents an id, retrieves corresponding object from id
//  * otherwise return the object
//  */
// async function fromId(data, name, plugin) {
//   if (typeof data === 'object') {
//     return data
//   }
//   return await strapi.query(name, plugin).findOne({ id: data })
// }

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

/**
 * Format address according to specification
 */
function formatAddress(config, format, addr) {
  format = config.addressFormats[format]
  if (typeof addr === 'string') {
    addr = formatAddress(format, config.addresses[addr])
  }

  return Object.entries(addr).reduce((acc, [key, value]) => {
    if (!value || !format[key]) {
      return acc
    }

    if (key === 'address') {
      for (const i in format.address) {
        if (format.address[i] && value[i]) {
          acc[format.address[i]] = value[i]
        }
      }

      // In case format requires seperate field for first and last name
    } else if (key === 'name' && Array.isArray(format[key])) {
      const { firstName, lastName } = splitName(value)
      acc[format.name[0]] = firstName
      acc[format.name[1]] = lastName
    } else {
      acc[format[key]] = value
    }
    return acc
  }, {})
}

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

/********************  IMPORTANT ********************
 *
 * PRICE: decimal units ($10.50)
 * AMOUNT: smallest unit of currency (1050¢)
 *
 ********************  IMPORTANT ********************/

const SMALLEST_CURRENCY_UNIT = 100
const toAmount = (price) => Math.round(price * SMALLEST_CURRENCY_UNIT)
const toPrice = (amount) => amount / SMALLEST_CURRENCY_UNIT

module.exports = {
  toId,
  // fromId,

  toAmount,
  toPrice,

  DefaultDict,

  generateAPI,
  toFullName,
  splitName,
  day,
  formatAddress,
  providerName: 'acs',
  secureKey: process.env.SECURE_KEY || 'Jle5GXz+MBiQbW2GVCjzZtwzQsen60/dipwsRJV+xio=',
  slugify(str='') {
    return str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes
  },
  removeNullValues(obj={}) {
    return Object.entries(obj).reduce(([k,v], acc) => {
      if (v !== null && v !== undefined) {
        acc[k] = v
      }
      return acc
    }, {})
  },
  paramsToArray(param) {
    if (Array.isArray(param)) {
      return param
    } else if (typeof param === 'string') {
      return [param]
    } else {
      return []
    }
  }
}
