'use strict'

const { toId, paramsToArray } = require('../../../utils')

async function getWardrobeProducts(wardrobe, props) {
  let wardrobeItems = await strapi
    .query('wardrobe-item')
    .find({ wardrobe: toId(wardrobe), ...props }, [])

  const productIds = [
    ...wardrobeItems.reduce((acc, { product }) => {
      acc.add(product)
      return acc
    }, new Set()),
  ]

  const products = await Promise.all(
    productIds.map((id) =>
      strapi.query('product').findOne({ id }, ['images', 'designer'])
    )
  )

  return products.filter((product) => product)
}

async function toWardrobeProps(body, wardrobe) {
  let props = {
    visible: false
  }

  if (body.name && body.name !== wardrobe.name) {
    props.name = body.name
  }
  if (body.description && body.description !== wardrobe.description) {
    props.description = body.description
  }
  if (!!body.visible !== !!wardrobe.visible) {
    props.visible = !!body.visible
  }

  const bodyTags = new Set(body.tags)
  if (
    body.tags &&
    (body.tags.length !== wardrobe.tags.length ||
      !wardrobe.tags.every((tag) => bodyTags.has(tag.name)))
  ) {
    const tags = await Promise.all(
      body.tags.map(async (tag) => {
        // Either find and return existing tag or create new tag
        const existingTag = await strapi.query('wardrobe-tag').findOne({ name: tag })
        if (existingTag) {
          return existingTag
        } else {
          return await strapi.query('wardrobe-tag').create({ name: tag })
        }
      })
    )
    props.tags = tags.map((tag) => tag.id)
  }

  return props
}

module.exports = {
  async delete(ctx) {
    const user = ctx.state.user
    const { slug } = ctx.params
    if (!slug) {
      return ctx.badRequest('Wardrobe does not exist')
    }
    await strapi.query('wardrobe').delete({ slug, user: toId(user) })
    ctx.send(null)
  },

  async create(ctx) {
    const user = ctx.state.user
    const { name } = ctx.request.body
    const slug = name
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')

    const wardrobes = await strapi
      .query('wardrobe')
      .find({ slug, user: toId(user) })
    if (wardrobes.length > 0) {
      return ctx.badRequest('Wardrobe already exists')
    } else {
      const wardrobe = await strapi
        .query('wardrobe')
        .create({ name, slug, user: toId(user) })
      return ctx.send(wardrobe)
    }
  },

  async update(ctx) {
    const user = ctx.state.user
    const { wardrobe_id } = ctx.params

    const body = ctx.request.body
    const wardrobe = await strapi.query('wardrobe').findOne({ id: wardrobe_id }, ['tags'])
    if (!wardrobe) {
      return ctx.badRequest('Wardrobe not found')
    }
    if (wardrobe.user !== user.id) {
      return ctx.unauthorized("You don't own this wardrobe")
    }

    const props = await toWardrobeProps(body, wardrobe)
    const createdWardrobe = await strapi.query('wardrobe').update({ id: wardrobe_id }, props)
    ctx.send(createdWardrobe)
  },

  async getUserWardrobes(ctx) {
    const user = ctx.state.user
    const user_id = Number(ctx.params.user_id)

    let wardrobes
    if (user.id === user_id) {
      wardrobes = await strapi.query('wardrobe').find({ user: user_id })
      wardrobes = [...wardrobes, { name: 'My wardrobe', slug: 'my-wardrobe' }]
    } else {
      wardrobes = await strapi
        .query('wardrobe')
        .find({ user: user_id, visible: true })
    }

    ctx.send(wardrobes)
  },

  // Handles logic related to filtering products based on wardrobe filters, etc.
  async filterWardrobes(ctx) {
    const data = await strapi.services.wardrobe.filterWardrobes(ctx.state.user, ctx.query)

    ctx.send({
      products: data.products,
      count: data.count,
      filters: data.filters,
      categories: data.categories,
    })
  },

  async searchWardrobes(ctx) {
    const { tags, search } = ctx.query
    const wardrobes = await strapi.services.wardrobe.searchWardrobes({
      search,
      tags: paramsToArray(tags),
      wardrobes: await strapi.query('wardrobe').find({visible: true}, ['user', 'tags'])
    })

    // fetch products from each wardrobe
    const data = await Promise.all(
      wardrobes.map(async (wardrobe) => {
        const products = await getWardrobeProducts(wardrobe, { _limit: 10 })
        return { products, wardrobe }
      })
    )
    ctx.send(data)
  },

  async searchUserWardrobes(ctx) {
    const user = ctx.state.user
    const { tags, search } = ctx.query
    const wardrobes = await strapi.services.wardrobe.searchWardrobes({
      search,
      tags: paramsToArray(tags),
      wardrobes: await strapi.query('wardrobe').find({user: user.id}, ['user', 'tags'])
    })

    // fetch products from each wardrobe
    const data = await Promise.all(
      wardrobes.map(async (wardrobe) => {
        const products = await getWardrobeProducts(wardrobe, { _limit: 10 })
        return { products, wardrobe }
      })
    )
    ctx.send(data)
  },
}
