const f = {}
f.designer = require('./designer-factory')

/**
 * Default data that factory uses
 */
const defaultData = {
  email: 'info+test@infinitecloset.co.uk',
  status: 'cart',
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
      url: '/uploads/image-1',
      size: 1000,
      hash: 'image-1',
      provider: 'local',
      ext: '.jpg',
      mime: 'image/jpeg',
    },
  ],
}

/**
 * Returns a mock updated with given data
 */
const mock = (options = {}) => {
  const suffix = Math.round(Math.random() * 10000).toString()
  return {
    ...defaultData,
    name: `Product ${suffix}`,
    slug: `product-${suffix}`,
    ...options,
  }
}

/**
 * Creates new product in strapi database, first calling mock() on `data`
 */
const create = async (strapi, data = {}) => {
  const productData = mock(data)
  if (!productData.designer) {
    const designer = await f.designer.create(strapi)
    productData.designer = designer.id
  } else if (typeof productData.designer === 'object') {
    const designer = await f.designer.create(strapi, productData.designer)
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
