'use strict'

async function availableCoupons(context) {
  return await strapi.query('coupon').findOne({ context })
}

async function availableCoupon(context, code) {
  return await strapi.query('coupon').findOne({ context, code: code })
}

module.exports = { availableCoupon, availableCoupons }
