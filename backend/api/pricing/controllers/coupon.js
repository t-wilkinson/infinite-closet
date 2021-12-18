'use strict'

async function discount(ctx) {
  const { discountCode, context, price } = ctx.request.body
  const user = ctx.state.user
  let existingCoupons
  if (user) {
    existingCoupons = await strapi.plugins[
      'orders'
    ].services.price.existingCoupons(user, discountCode)
  } else {
    existingCoupons = []
  }

  const summary = await strapi.services.price.summary({
    discountCode,
    price,
    context,
    existingCoupons,
  })

  ctx.send(strapi.services.price.sanitizeSummary(summary))
}

module.exports = {
  discount,
}
