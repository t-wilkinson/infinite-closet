// TODO: convert to object<string, int>?

const sizeEnum = () => strapi.query("custom.sizes").model.attributes.size.enum;

module.exports = {
  enum: sizeEnum,
  range({ size: start, sizeRange: end }) {
    return sizeEnum.slice(sizeEnum().indexOf(start), sizeEnum.indexOf(end) + 1);
  },
  normalize(size) {
    return size.replace("_", "");
  },
};
