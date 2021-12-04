// Return available categories for header navigation
async function routes(ctx) {
  const categories = await strapi.query('category').find(
    {
      slug_in: ['clothing', 'accessories'],
    },
    ['categories']
  )

  let routes = {}
  for (const category of categories) {
    routes[category.slug] = category
  }

  const occasions = await strapi.query('occasion').find({})

  ctx.send({
    routes,
    occasions,
  })
}

// Return product for the shop page
async function shopItem(ctx) {
  const slug = ctx.params.slug
  const product = await strapi
    .query('product')
    .findOne({ published_at_null: false, slug }, ['designer', 'images', 'sizes'])

  for (const [key, size] of Object.entries(product.sizes)) {
    product.sizes[key].size = strapi.services.size.normalize(size.size)
  }

  ctx.send(product)
}

function toCSVRow(row, columns) {
  return Object.entries(row)
    .sort(([k1], [k2]) => columns.indexOf(k1) - columns.indexOf(k2)) // make sure rows align with columns
    .map(([, v]) =>
      v === undefined || v === null
        ? '""'
        : `"${v.toString().trim().replace(/\n/g, '\t').replace(/"/g, '""')}"`
    )
    .join(',')
}

async function facebookCatalog(ctx) {
  const columns = [
    'id',
    'item_group_ID',
    'google_product_category',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'additional_image_link',
    'color',
    'gender',
    'size',
    'age_group',
  ]

  function toRow(product, size, quantity) {
    return {
      id: `${product.id}_${size}`,
      item_group_ID: product.id,
      google_product_category: 'Clothing & Accessories > Clothing > Dresses',
      title: product.name,
      description: `${product.details ? product.details + '.\n' : ''}Rent ${
        product.name
      } by ${product.designer.name} for only £${
        product.shortRentalPrice
      } at Infinite Closet`,
      availability: quantity > 0 ? 'in stock' : 'available for order',
      condition: 'used',
      price: product.shortRentalPrice + ' GBP',
      link: `https://${process.env.FRONTEND_DOMAIN}/shop/${product.designer.slug}/${product.slug}`,
      image_link: `https://${process.env.BACKEND_DOMAIN}${product.images[0].url}`,
      brand: product.designer.name,
      additional_image_link: product.images
        .slice(1)
        .map((image) => `https://${process.env.BACKEND_DOMAIN}${image.url}`)
        .join(','),
      color: product.colors[0] && product.colors[0].name,
      gender: 'female',
      size: size,
      age_group: 'adult',
    }
  }

  const products = await strapi
    .query('product')
    .find({ published_at_null: false }, [
      'designer',
      'colors',
      'images',
      'sizes',
    ])

  let rows = new Set() // Don't want rows with duplicate ids
  // Convert each product to a CSV row
  for (const product of products) {
    // Each product variant such as different size should be considered seperate
    for (const size of product.sizes) {
      for (const sizeItem of strapi.services.size.sizes(size)) {
        try {
          const row = toRow(
            product,
            sizeItem,
            size.quantity
          )
          rows.add(toCSVRow(row, columns))
        } catch (e) {
          strapi.log.error('facebook-catalog %o', e)
        }
      }
    }
  }

  ctx.set({
    'Content-Disposition': 'attachment; filename="facebook-catalog.csv"',
    'Content-Type': 'text/csv; charset=utf-8',
  })

  // Add columns to the top
  rows = [toCSVRow(columns), ...rows]
  ctx.send(rows.join('\n'))
}

async function acsStockSetup(ctx) {
  const columns = [
    'product_sku',
    'unique_sku',
    'name',
    'designer',
    'garment_type',
    'sizes',
    'description',
  ]
  const products = await strapi
    .query('product')
    .find({ published_at_null: false }, [
      'categories',
      'designer',
      'colors',
      'images',
      'sizes',
    ])

  function toRow(product, size, index) {
    const range = strapi.services.size.range(size)
    const categories = product.categories
      .map((category) => category.name)

    return {
      product_sku: product.id,
      unique_sku: `IC-${product.id}_${index}-${range}`,
      name: product.name,
      designer: product.designer.name,
      garment_type: categories.join(', '),
      sizes: range,
      description: product.details,
    }
  }

  let rows = new Set()
  for (const product of products) {
    for (const size of product.sizes) {
      for (let i = 1; i <= size.quantity; i++) {
        try {
          const row = toRow(product, size, i)
          rows.add(toCSVRow(row, columns))
        } catch (e) {
          strapi.log.error('acs-stock-setup %o', e)
        }
      }
    }
  }

  ctx.set({
    'Content-Disposition': 'attachment; filename="acs-stock.csv"',
    'Content-Type': 'text/csv; charset=utf-8',
  })

  // Put columns at the top
  rows = [toCSVRow(columns), ...rows]
  ctx.send(rows.join('\n'))
}

module.exports = {
  routes,
  shopItem,
  facebookCatalog,
  acsStockSetup,
}
