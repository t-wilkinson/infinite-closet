'use strict'

const {toId} = require('../../../utils')

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

module.exports = {
  toKey,
  price,
}
