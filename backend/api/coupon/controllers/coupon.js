'use strict'

async function discount(ctx) {
  return ctx.send(
    (await strapi.services.coupon.discount(ctx.request.body)) || {}
  )
}

module.exports = {
  discount,
}
