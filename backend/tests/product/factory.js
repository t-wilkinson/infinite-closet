/**
 * Default data that factory uses
 */
const defaultData = {
  name: 'Product 1',
  slug: 'product-1',
  email: 'info+test@infinitecloset.co.uk',
  status: 'cart',
  designer: {
    name: 'Designer 1',
    slug: 'designer-1',
  },
  sizes: [
    {
      size: 'S',
      quantity: 1,
    },
  ],
  shortRentalPrice: 10,
  longRentalPrice: 20,
  retailPrice: 100,
  purchasePrice: 100,
}

/**
 * Returns a mock updated with given data
 */
const mock = (options = {}) => {
  return {
    ...defaultData,
    ...options,
  }
}

/**
 * Creates new product in strapi database, first calling mock() on `data`
 */
const create = async (strapi, data={}) => {
  const productData = mock(data)
  if (typeof productData.designer === 'object') {
    const designer = await strapi.query('designer').create(productData.designer)
    productData.designer = designer.id
  }

  // for (const [i, sizeData] of Object.entries(productData.sizes)) {
  //   if (typeof sizeData === 'object') {
  //     const size = await strapi.query('sizes').create
  //     productData.sizes[i]
  //    productData.sizes.filter(size => typeof size === 'object')
  //   }
  // }
  return await strapi.query('product').create(productData)
}

module.exports = {
  mock,
  create,
  defaultData,
}
