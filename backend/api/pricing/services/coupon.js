'use strict'

const { day } = require('../../../utils')

/**
 * Find coupon matching code
 */
async function availableCoupon(context, code) {
  if (typeof code !== 'string') {
    return null
  }
  return await strapi
    .query('coupon')
    .findOne({ context, code: code.toUpperCase() })
}

/**
 * Is coupon valid given existing uses of that coupon code?
 * @param {Coupon} coupon - Supplied coupon, the database object
 * @param {Coupon[]=[]} existingCoupons - List of existing coupons with same code that are related to current discount transaction. Ex. the coupons attached to orders of current user.
 */
function valid(coupon, existingCoupons = []) {
  if (!coupon) {
    return false
  }

  const expires = day(coupon.expiration)
  if (coupon.expiration && day().isAfter(expires, 'day')) {
    return false
  }

  const existingCouponCount = existingCoupons.reduce(
    (n, x) => n + (x.code === coupon.code),
    0
  )
  const couponMaxedOut = coupon.maxUses <= existingCouponCount
  if (couponMaxedOut) {
    return false
  }

  return true
}

module.exports = {
  availableCoupon,
  valid,
}
