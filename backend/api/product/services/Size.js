// TODO: convert to object<string, int>?

const sizeEnum = () => strapi.query('custom.sizes').model.attributes.size.enum

function range({ size: start, sizeRange: end }) {
  const sizes = sizeEnum()
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
