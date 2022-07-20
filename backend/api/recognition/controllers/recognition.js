"use strict"
const fetch = require('node-fetch')
const fs = require('fs')
const https = require('https')
const models = require('../../../data/data.js').models
const { slugify, toId } = require('../../../utils')

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // TODO: potentially dangerous
})

function base64Encode(file) {
  return fs.readFileSync(file, {encoding: 'base64'})
}

/**
 * Create a product attaching filters from form request
 * @param {obj} request - Multipart form data which contains filters to attach to product
 * @returns {Product}
 */
async function createProduct(request, user) {
  const queryFilters = request.body
  const body = request.body
  const images = request.files

  const getFilterIds = async (filter, slugs) => strapi
    .query(models[filter])
    .find({ slug_in: slugs }, [])
    .then(res => res.map(toId))

  // filters from queryFilters
  let filters = {}
  for (const filter in models) {
    if (filter === 'sizes') {
      continue
    }
    filters[filter] = await getFilterIds(filter, JSON.parse(queryFilters[filter]))
  }

  const uploads = await strapi.plugins['upload'].services.upload.upload({
    data: {},
    files: Object.values(images).map((image) => ({
      path: image.path,
      name: image.name,
      type: image.type,
      size: image.size,
    })),
  })

  const designer = await strapi.query('designer').findOne({ slug: filters.designer })

  const product = await strapi.query('product').create({
    name: body.name,
    slug: `${slugify(body.name)}-${Math.floor(Math.random() * 100000)}`,
    user: toId(user),
    images: uploads,
    ...filters,
    designer,
  })

  return product
}

module.exports = {
  async availableFilters(ctx) {
    let filters = {}
    for (const filter in models) {
      if (['sizes'].includes(filter)) {
        continue
      }
      filters[filter] = await strapi.query(models[filter]).find()
    }
    filters.designer = await strapi.query('designer').find()
    ctx.send(filters)
  },

  async handleRecognitionNotification(ctx) {
    const body = ctx.request.body
    console.log(ctx.request.header, body)
    const { id, originalRequestId, status, productItems } = body
    const notification = await strapi.query('bloomino-notification').findOne({ requestId: originalRequestId })
    console.log(notification)

    if (!notification) {
      return ctx.badRequest({
        status: 0,
        detail: "Notification could not be found in database",
      })
    }

    return ctx.send({
      status: "OK",
      description: "Received notification.",
    })
  },

  async handleRecognition(ctx) {
    const user = ctx.state.user

    const product = await createProduct(ctx.request, user)
    const wardrobeItem = await strapi
      .query('wardrobe-item')
      .create({
        user: toId(user),
        wardrobe: null,
        product: toId(product),
      })

    try {
      const config = strapi.services.bloomino.config
      const images = ctx.request.files
      const req = {
        body: JSON.stringify({
          data: Object.values(images).map((image, i) =>
            ({
              dataId: `${i}`,
              mimeType: image.type,
              data: base64Encode(image.path),
            })
          ),
          userId: user.username,
          userEmail: user.email,
        }),
        agent: httpsAgent,
        method: "POST",
        headers: {
          "XApiKey": config.apiKey,
          'Accept': '*/*',
          // "Authorization": `Bearer ${Buffer.from(config.apiKey).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }

      console.log(req)
      const res = await fetch(`${config.apiUrl}/${config.endpoints.doRecognition}`, req)
      console.log(res, res.headers, res.body, await res.text())
      const body = await res.json()
      console.log(body)
      await strapi.query('bloomino-notification').create({ requestId: body.requestId, code: body.code, message: body.message })

      ctx.send(product)
    } catch (e) {
      console.log(e.message)
      console.log(e.stack)
      console.log(e)
    }

    ctx.badRequest(null)
  }
}
