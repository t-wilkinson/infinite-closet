'use strict'

const { slugify, toId } = require('../../../utils')
const models = require('../../../data/data.js').models

module.exports = {
  async editProductWardrobeItem(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body
    const images = ctx.request.files
    const queryFilters = ctx.request.body

    const { product_id } = ctx.params
    const wardrobeItem = await strapi.query('wardrobe-item')
      .findOne({ product: product_id, user: user.id })

    if (!wardrobeItem) {
      return ctx.notFound('Could not find product id.')
    }
    const product = wardrobeItem.product
    console.log(product)

    // Make sure user owns product
    if (toId(product.user) !== user.id) {
      return ctx.unauthorized('User does not own this product.')
    }

    const getFilterIds = async (filter, slugs=[]) => strapi
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

    const previousImages = JSON.parse(ctx.request.body.previousImages)
    console.log(images, uploads, previousImages)

    for (const upload of uploads) {
      const image = previousImages[upload.name]
      console.log('update upload image:', image)
      if (image) {
        strapi.query('file', 'upload')
          .update({
            id: upload.id,
            rotation: `${image.rotation || 0}`
          })
      }
    }

    for (const url in previousImages) {
      const image = previousImages[url]
      console.log('update previous image:', image)
      if (image?.id) {
        strapi.query('file', 'upload')
          .update({
            id: image.id,
            rotation: `${image.rotation || 0}`
          })
      }
    }

    await strapi.query('product').update({ id: product_id}, {
      name: body.name,
      slug: product.slug || `${slugify(body.name)}-${Math.floor(Math.random() * 100000)}`,
      images: [
        ...Object.values(previousImages).map(image => image.id).filter(x => x),
        ...uploads.map(upload => upload.id),
      ],
      ...filters,
      customDesignerName: body.designer,
    })

    ctx.send(null)
  },

  async getWardrobeItems(ctx) {
    const user = ctx.state.user
    const { product_id } = ctx.params
    const wardrobeItems = await strapi
      .query('wardrobe-item')
      .find({ user: toId(user), product: product_id })

    ctx.send(wardrobeItems)
  },

  async createItem(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body
    const wardrobeItem = await strapi.query('wardrobe-item').create({
      user: toId(user),
      wardrobe: body.wardrobeId || null,
      product: body.productId,
    })
    ctx.send(wardrobeItem)
  },

  async deleteItem(ctx) {
    const user = ctx.state.user
    const { item_id } = ctx.params

    await strapi
      .query('wardrobe-item')
      .delete({ user: toId(user), id: item_id })
    ctx.send(null)
  },
}
