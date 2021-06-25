// TODO: convert to object<string, int>?

const sizeEnum = () => strapi.query("custom.sizes").model.attributes.size.enum;

module.exports = {
  enum: sizeEnum,
  range({ size: start, sizeRange: end }) {
    const sizes = sizeEnum();
    return sizes.slice(sizes.indexOf(start), sizes.indexOf(end) + 1);
  },
  normalize(size) {
    return size.replace("_", "");
  },
};
