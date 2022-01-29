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
 * @param {object} obj
 * @param {number} obj.outOfStockTotal - In case coupons have a modifier that prevents them being applied to items not in stock
 */
async function discount({ outOfStockTotal, price, context, discountCode, existingCoupons }) {
  let giftCard = await strapi.services.giftcard.availableGiftCard(
    discountCode
  )
  const isGiftCardValid = await strapi.services.giftcard.valid(giftCard)
  let giftCardDiscount = await strapi.services.giftcard.discount(
    price,
    giftCard,
    isGiftCardValid
  )
  if (!isGiftCardValid) {
    giftCardDiscount = 0
    giftCard = null
  }

  let coupon = await strapi.services.coupon.availableCoupon(
    discountCode,
    context
  )
  const isCouponValid = await strapi.services.coupon.valid(
    coupon,
    existingCoupons
  )
  let couponDiscount = await strapi.services.coupon.discount({
    price,
    coupon,
    isCouponValid,
    outOfStockTotal,
  })
  if (!isGiftCardValid) {
    couponDiscount = 0
    coupon = null
  }

  return {
    discountPrice: giftCardDiscount + couponDiscount,
    giftCardDiscount,
    couponDiscount,
    giftCard,
    coupon,
  }
}

/**
 * Price summary including discount, subtotal, etc.
 */
async function summary({ outOfStockTotal, price, context, discountCode, existingCoupons }) {
  const { discountPrice, giftCardDiscount, couponDiscount, coupon, giftCard } =
    await discount({
      outOfStockTotal,
      price,
      context,
      discountCode,
      existingCoupons,
    })
  const total = price - discountPrice

  return {
    giftCardDiscount,
    couponDiscount,
    discount: discountPrice,
    coupon,
    subtotal: price,
    total,
    giftCard,
    amount: toAmount(total),
  }
}

function sanitizeSummary(summary) {
  return {
    ...summary,
    giftCard: sanitizeEntity(summary.giftCard, {
      model: strapi.query('gift-card').model,
    }),
    coupon: sanitizeEntity(summary.coupon, {
      model: strapi.query('coupon').model,
    }),
  }
}

module.exports = {
  toAmount,
  toPrice,
  summary,
  sanitizeSummary,
}
