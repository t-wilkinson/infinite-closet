'use strict'

/********************  IMPORTANT ********************
 *
 * PRICE: decimal units ($10.50)
 * AMOUNT: smallest unit of currency (1050¢)
 *
 ********************  IMPORTANT ********************/

const { sanitizeEntity } = require('strapi-utils')
const SMALLEST_CURRENCY_UNIT = 100

// Services like stripe expect no decimal points, and to be in units of smallest currency
const toAmount = (price) => Math.round(price * SMALLEST_CURRENCY_UNIT)
const toPrice = (amount) => amount / SMALLEST_CURRENCY_UNIT

/**
 * Calculate the discount given the coupon and price
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
 * Price summary including discount, subtotal, etc.
 */
async function summary({ price, context, couponCode, existingCoupons }) {
  const coupon = await strapi.services.coupon.availableCoupon(context, couponCode)
  const isValid = strapi.services.coupon.valid(coupon, existingCoupons)
  const discountPrice = isValid ? discount(coupon, price) : 0
  const total = price - discountPrice

  return {
    valid: isValid,
    discount: discountPrice,
    coupon,
    subtotal: price,
    total,
    amount: toAmount(total),
  }
}

function sanitizeSummary(summary) {
  return {
    ...summary,
    coupon: sanitizeEntity(summary.coupon, {
      model: strapi.query('coupon').model,
    }),
  }
}

module.exports = {
  toAmount,
  toPrice,

  discount,
  summary,
  sanitizeSummary,
}
