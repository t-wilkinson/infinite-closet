const defaultData = {
  designer: {
    name: 'Designer 1',
    slug: 'designer-1',
  },
}

const mock = (opt = {}) => ({
  ...defaultData,
  ...opt,
})

const create = async (strapi, opt={}) => {
  const designer = await strapi.query('designer').create(mock(opt))
  return designer
}

module.exports = {
  defaultData,
  mock,
  create,
}
