const defaultData = {
  designer: {
  },
}

const mock = (opt = {}) => {
  const suffix = Math.round(Math.random() * 10000).toString()
  return {
    ...defaultData,
    name: `Designer ${suffix}`,
    slug: `designer-${suffix}`,
    ...opt,
  }
}

const create = async (strapi, opt={}) => {
  const designer = await strapi.query('designer').create(mock(opt))
  return designer
}

module.exports = {
  defaultData,
  mock,
  create,
}
