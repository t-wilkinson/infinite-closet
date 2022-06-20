"use strict"
const fetch = require('node-fetch')
const fs = require('fs')
const https = require('https')
const models = require('../../../data/data.js').models
const { slugify, toId } = require('../../../utils')

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
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
    slug: slugify(body.name),
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

      /*
      const config = strapi.services.bloomino.config
      const images = ctx.request.files
      const res = await fetch(`${config.apiUrl}/${config.endpoints.doRecognition}`, {
        agent: httpsAgent, // TODO: potentially dangerous
        method: "POST",
        headers: {
          "XApiKey": config.apiKey,
          "X-Api-Key": config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'bloomino',
          userEmail: 'bloomino@bloomino.co.uk',
          data: Object.values(images).map((image, i) =>
            ({
              dataId: i,
              mimeType: image.type,
              data: base64Encode(image.path),
            })
          )
        })
      })
      */

      ctx.send(product)
    } catch (e) {
      console.log(e.message)
      console.log(e.stack)
      console.log(e)
    }

    ctx.send(null)
  }
}
