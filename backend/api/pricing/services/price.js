'use strict'

/********************  IMPORTANT ********************
 *
 * PRICE: decimal units ($10.50)
 * AMOUNT: smallest unit of currency (1050¢)
 *
 ********************  IMPORTANT ********************/

const SMALLEST_CURRENCY_UNIT = 100

// Services like stripe expect no decimal points, and to be in units of smallest currency
const toAmount = (price) => Math.round(price * SMALLEST_CURRENCY_UNIT)
const toPrice = (amount) => amount / SMALLEST_CURRENCY_UNIT

/**
 * Calculate the discount given the coupon and price
 * @param {Coupon} coupon
 * @param {number} price
 *
 * @returns {number}
 */
function discount(coupon, price) {
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
 * Calculates the discount price given coupon
 * @param {Coupon} coupon - Supplied coupon, the database object
 * @param {=Coupon[]} existingCoupons - List of existing coupons with same code that are related to current discount transaction. Ex. the coupons attached to orders of current user.
 *
 * @returns {Object} Containing the new price, discounted price, and a reference to the coupon used
 */
function valid(coupon, existingCoupons = []) {
  if (!coupon) {
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

/**
 * Find coupon matching code
 */
async function availableCoupon(context, code) {
  return await strapi
    .query('coupon')
    .findOne({ context, code: (code || '').toUpperCase() })
}

/**
 * Price summary including discount, subtotal, etc.
 */
async function summary({ price, context, code, existingCoupons }) {
  const coupon = await availableCoupon(context, code)
  const isValid = valid(coupon, existingCoupons)
  const discountPrice = isValid ? discount(coupon, price) : 0

  return {
    total: price - discountPrice,
    subtotal: price,
    discount: discountPrice,
    valid: isValid,
    coupon,
  }
}

module.exports = {
  toAmount,
  toPrice,

  availableCoupon,
  discount,
  summary,
  valid,
}
