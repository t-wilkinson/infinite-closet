'use strict'

const sizeEnum = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '_2XL']

function range({ size: start, sizeRange: end }) {
  const sizes = sizeEnum
  if (end) {
    return sizes.slice(sizes.indexOf(start), sizes.indexOf(end) + 1)
  } else {
    return [sizes[sizes.indexOf(start)]]
  }
}

module.exports = {
  enum: sizeEnum,
  range,

  contains(order, size) {
    return range(order).includes(size)
  },

  normalize(size) {
    return size.replace('_', '')
  },
}
