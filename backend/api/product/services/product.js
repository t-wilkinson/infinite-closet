'use strict'

const { toId } = require('../../../utils')

const rentalPrice = {
  short: 'shortRentalPrice',
  long: 'longRentalPrice',
}

function price(product, rentalLength) {
  return product[rentalPrice[rentalLength]]
}

/**
 * Allow us to group orders by the unique products they refer to
 * @return {string} Unique key
 */
function toKey({ product, size }) {
  const productId = toId(product)
  return `${strapi.services.size.normalize(size)}_${productId}`
}

/**
 * Return quantity of specific product size
 * @returns {number}
 */
async function quantity({ size, product }) {
  if (product.sizes) {
    return strapi.services.size.quantity(product.sizes, size)
  } else if (product) {
    product = await strapi
      .query('product')
      .findOne({ id: toId(product) }, ['sizes'])
    return strapi.services.size.quantity(product.sizes, size)
  } else {
    return 0
  }
}


async function recommendations() {
  const productSlugs = [
    'greta-outer-space-dress',
    'illegal-halter',
    'polka-blue-dots',
    'simone-night-fall',
  ]
  const products = await strapi
    .query('product')
    .find({ slug_in: productSlugs }, ['designer', 'colors', 'images', 'sizes'])
  return products
}

module.exports = {
  toKey,
  price,
  recommendations,
  quantity,
}
