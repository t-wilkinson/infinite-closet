'use strict'

module.exports = {
  async verify(ctx) {
    const { postcode } = ctx.params
    const valid = await strapi.services.address.verify(postcode)
    ctx.send({
      valid,
    })
  },
}
