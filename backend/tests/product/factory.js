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
  images: [
    {
      name: 'Image 1',
      alternativeText: "Image 1",
      url: 'http://infinitecloset.co.uk/image-1',
      size: 1000,
      hash: 'image-1',
      mime: 'image/jpg',
      provider: 'local',
    },
  ],
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
const create = async (strapi, data = {}) => {
  const productData = mock(data)
  if (typeof productData.designer === 'object') {
    const designer = await strapi.query('designer').create(productData.designer)
    productData.designer = designer.id
  }

  for (const [i, imageData] of Object.entries(productData.images)) {
    if (typeof imageData === 'object') {
      const image = await strapi.query('file', 'upload').create(imageData)
      productData.images[i] = image.id
    }
  }
  return await strapi.query('product').create(productData)
}

module.exports = {
  mock,
  create,
  defaultData,
}
