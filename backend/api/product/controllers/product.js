const models = require('../../../data/data.js').models

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
    .findOne({ published_at_null: false, slug }, [
      'designer',
      'images',
      'sizes',
      ...Object.keys(models),
    ])

  if (!product) {
    return ctx.badRequest('Product could not be found.')
  }

  for (const [key, size] of Object.entries(product.sizes)) {
    product.sizes[key].size = strapi.services.size.normalize(size.size)
  }

  ctx.send(product)
}

async function getDesigner(ctx) {
  const { slug } = ctx.params
  let designer = await strapi.query('designer').findOne(
    {
      slug,
    },
    ['products']
  )
  designer.products = await strapi
    .query('product')
    .find({ id_in: designer.products.map((product) => product.id) }, [
      'sizes',
      'categories',
      'images',
    ])
  ctx.send(designer)
}

async function getDesigners(ctx) {
  let designers = await strapi.query('designer').find(
    {
      published_at_null: false,
    },
    ['products']
  )
  designers = await Promise.all(
    designers.map(async (designer) => {
      const products = await strapi
        .query('product')
        .find({ id_in: designer.products.map((product) => product.id) }, [
          'sizes',
          'categories',
          'images',
        ])
      return { ...designer, products }
    })
  )
  ctx.send(designers)
}

module.exports = {
  routes,
  shopItem,
  getDesigners,
  getDesigner,
}
