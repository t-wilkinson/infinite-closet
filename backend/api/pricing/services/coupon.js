'use strict'

async function availableCoupons(context) {
  return await strapi.query('coupon').findOne({ context })
}

async function availableCoupon(context, code) {
  return await strapi
    .query('coupon')
    .findOne({ context, code: code.toUpperCase() })
}

function discountedPrice(coupon, price) {
  switch (coupon.type) {
    case 'percent_off':
      return price * (coupon.amount / 100)
    case 'amount_off':
      return coupon.amount
    default:
      return 0
  }
}

// TODO: should we throw an error instead?
// TODO: should this just calculate discount (not the price)? Should merge this with existing discount code
/**
 * Calculates the discount price given coupon
 * @param {Object} obj
 * @param {number} obj.price - The calculated price
 * @param {string} obj.coupon - Supplied coupon, the database object
 * @param {=Coupon[]} obj.existingCoupons - List of existing coupons with same code that are related to current discount transaction. Ex. the coupons attached to orders of current user.
 *
 * @returns {Object} Containing the new price, discounted price, and a reference to the coupon used
 */
function discount({ price, coupon, existingCoupons = [] }) {
  if (!coupon) {
    return { valid: false, reason: 'not-found' }
  }

  const existingCouponCount = existingCoupons.reduce(
    (n, x) => n + (x.code === coupon.code),
    0
  )
  const couponMaxedOut = coupon.maxUses <= existingCouponCount
  if (couponMaxedOut) {
    return { valid: false, reason: 'maxed-out' }
  }

  const discount = discountedPrice(coupon, price)

  return {
    valid: true,
    discount,
    price: price - discount,
  }
}

module.exports = { availableCoupon, availableCoupons, discount }
