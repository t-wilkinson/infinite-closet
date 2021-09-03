'use strict'

const rentalPrice = {
  short: 'shortRentalPrice',
  long: 'longRentalPrice',
}

function price(product, rentalLength) {
  return product[rentalPrice[rentalLength]]
}

module.exports = {
  price,
}
