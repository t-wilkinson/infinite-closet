'use strict'

const { day } = require('../../../utils')

/**
 * Find coupon matching code
 */
async function availableCoupon(code, context = 'checkout') {
  if (typeof code !== 'string') {
    return null
  }
  return await strapi
    .query('coupon')
    .findOne({ context, code: code.toUpperCase() })
}

function discount({
  price, coupon, valid = true,
  outOfStockTotal=0,
}) {
  if (!valid) {
    return 0
  }

  if (price < (coupon.minActivePrice || 0)) {
    return 0
  }

  if (coupon.restrictToStock) {
    price = Math.max(0, price - outOfStockTotal)
  }

  switch (coupon.type) {
    case 'percent_off':
      return price * (coupon.amount / 100)
    case 'amount_off':
      return coupon.amount
    default:
      return 0
  }
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
  discount,
}
