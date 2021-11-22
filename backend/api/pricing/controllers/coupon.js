'use strict'

async function discount(ctx) {
  const { code, context, price } = ctx.request.body
  const user = ctx.state.user
  let existingCoupons
  if (user) {
    existingCoupons = await strapi.plugins[
      'orders'
    ].services.price.existingCoupons(user, code)
  } else {
    existingCoupons = []
  }

  const summary = await strapi.services.price.summary({
    code,
    price,
    context,
    existingCoupons,
  })

  ctx.send(summary)
}

module.exports = {
  discount,
}
