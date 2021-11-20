'use strict'

const rentalPrice = {
  short: 'shortRentalPrice',
  long: 'longRentalPrice',
}

function price(product, rentalLength) {
  return product[rentalPrice[rentalLength]]
}

/**
 * Strapi potentialy stores nested objects in different ways.
 * This function normalizes the extraction of the id field.
 * @param {object} obj The nested database property
 * @returns {string} Id of the nested database property
 */
function itemId(obj) {
  if (obj === undefined) {
    return undefined
  } else if (obj.id !== undefined) {
    return obj.id
  } else {
    return obj
  }
}

/**
 * Allow us to group orders by the unique products they refer to
 * @return {string} Unique key
 */
function toKey({ product, size }) {
  const productId = itemId(product)
  return `${strapi.services.size.normalize(size)}_${productId}`
}

module.exports = {
  itemId,
  toKey,
  price,
}
