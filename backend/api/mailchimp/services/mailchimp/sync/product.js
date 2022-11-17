'use strict'

const _ = require('lodash')
const marketing = require('../marketing')
const { ids } = require('../config')
const storeId = ids('store')

const toMailchimp = (id, product) => {
  if (product.user || !product.designer) {
    return null
  }

  const title = `${product.name} by ${product.designer.name}`
  const variants = product.sizes.map((size) => ({
    id: `${id}_${size.size}`,
    title,
    inventory_quantity: size.quantity,
  }))
  const images = product.images.map((image) => ({
    id: image.url,
    url: `https://${process.env.BACKEND_DOMAIN}${image.url}`,
    variant_ids: variants.map((variant) => variant.id),
  }))

  return {
    id,
    title,
    variants,
    url: `https://${process.env.FRONTEND_DOMAIN}/shop/${product.designer.slug}/${product.slug}`,
    image_url: images[0].url,
    images,
    description: `${product.details ? product.details + '.\n' : ''}Rent ${
      product.name
    } by ${product.designer.name} for only £${
      product.shortRentalPrice
    } at Infinite Closet`,
    vender: product.designer.name,
  }
}

const sync = {
  async add(key, localItem) {
    await marketing.ecommerce.addStoreProduct(
      storeId,
      toMailchimp(key, localItem)
    )
  },
  async delete(key) {
    await marketing.ecommerce.deleteStoreProduct(storeId, key)
  },
  async update(key, localItem) {
    await marketing.ecommerce.updateStoreProduct(
      storeId,
      key,
      _.omit(toMailchimp(key, localItem), ['id'])
    )
  },
}

async function getLocalItems() {
  const localProducts = await strapi
    .query('product')
    .find({ published_at_null: false }, ['designer', 'images', 'sizes'])

  const products = localProducts.reduce((products, product) => {
    products[product.id] = product
    return products
  }, {})

  return products
}

async function getMailchimpItems() {
  const res = await marketing.ecommerce.getAllStoreProducts(storeId, {
    fields: ['id', 'products', 'total_items'],
    count: 1000,
  })

  if (res.total_items >= 1000) {
    const err = new Error('Products list too long')
    strapi.services.template_email.mailchimpLimitReached(err)
    throw err
  }

  const mailchimpProducts = (res.products || []).reduce((products, product) => {
    products[product.id] = product
    return products
  }, {})
  return mailchimpProducts
}

const all = async () => {
  await strapi.services.mailchimp.sync.all(
    sync,
    await getLocalItems(),
    await getMailchimpItems()
  )
  strapi.log.info('Sync mailchimp products')
}

module.exports = {
  toMailchimp,
  getLocalItems,
  getMailchimpItems,
  sync,
  all,
}
