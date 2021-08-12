'use strict'

async function discount(ctx) {
  const body = ctx.request.body
  const existingCoupons = await strapi.plugins[
    'orders'
  ].services.price.existingCoupons(body.user, body.code)
  const discount = strapi.plugins['orders'].services.price.discount({
    ...body,
    coupon: await strapi.services.coupon.availableCoupon(
      body.context,
      body.code
    ),
    existingCoupons,
  })
  return ctx.send(discount)
}

module.exports = {
  discount,
}
