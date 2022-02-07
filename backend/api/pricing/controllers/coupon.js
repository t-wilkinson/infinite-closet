'use strict'

async function discount(ctx) {
  const { discountCode, context, price } = ctx.request.body
  const user = ctx.state.user

  const summary = await strapi.services.price.summary({
    user,
    price,
    discountCode,
    context,
  })

  ctx.send(strapi.services.price.sanitizeSummary(summary))
}

module.exports = {
  discount,
}
