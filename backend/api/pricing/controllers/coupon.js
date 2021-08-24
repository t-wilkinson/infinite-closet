'use strict'

// TODO: abstract some of this functionality
async function discount(ctx) {
  const { code, user, context, price } = ctx.request.body
  const existingCoupons = await strapi.plugins[
    'orders'
  ].services.price.existingCoupons(user, code)

  const summary = await strapi.services.price.summary({
    code,
    price,
    context,
    existingCoupons,
  })

  // TODO: clean this up
  ctx.send({ ...summary, price: summary.price })
}

// async function valid(ctx) {
//   const {code, user, context, existingCoupons} = ctx.request.body
//   const coupon = await strapi.services.price.availableCoupon(context, code)
//   const existingCouponsDefault = await strapi.plugins['orders'].services.price.existingCoupons(user, code)

//   const valid = strapi.services.price.valid(coupon, existingCoupons ||existingCouponsDefault)
//   ctx.send(valid)
// }

module.exports = {
  discount,
  // valid,
}
