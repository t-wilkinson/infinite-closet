// TODO: convert to object<string, int>?

const sizeEnum = () => strapi.query('custom.sizes').model.attributes.size.enum;

function range({ size: start, sizeRange: end }) {
  const sizes = sizeEnum();
  return sizes.slice(sizes.indexOf(start), sizes.indexOf(end) + 1);
}

module.exports = {
  enum: sizeEnum,
  range,

  contains(order, size) {
    return range(order).contains(size);
  },

  normalize(size) {
    return size.replace('_', '');
  },
};
