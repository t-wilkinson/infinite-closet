'use strict'

const { toId } = require('../../../utils')

module.exports = {
  async getWardrobeItems(ctx) {
    const user = ctx.state.user
    const { product_id } = ctx.params
    const wardrobeItems = await strapi
      .query('wardrobe-item')
      .find({ user: toId(user), product: product_id })

    ctx.send(wardrobeItems)
  },

  async createItem(ctx) {
    const user = ctx.state.user
    const body = ctx.request.body
    const wardrobeItem = await strapi.query('wardrobe-item').create({
      user: toId(user),
      wardrobe: body.wardrobeId || null,
      product: body.productId,
    })
    ctx.send(wardrobeItem)
  },

  async deleteItem(ctx) {
    const user = ctx.state.user
    const { item_id } = ctx.params

    await strapi
      .query('wardrobe-item')
      .delete({ user: toId(user), id: item_id })
    ctx.send(null)
  },
}
