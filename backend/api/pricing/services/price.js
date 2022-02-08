'use strict'
/********************  IMPORTANT ********************
 *
 * PRICE: decimal units ($10.50)
 * AMOUNT: smallest unit of currency (1050¢)
 *
 ********************  IMPORTANT ********************/

const { toId } = require('../../../utils')
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
async function discount({
  price,
  outOfStockTotal,

  coupon,
  existingCoupons,

  giftCard,
  giftCardPurchases,
  giftCardPaymentIntent,
}) {
  const isGiftCardValid = strapi.services.giftcard.valid(giftCard, giftCardPaymentIntent)
  let giftCardDiscount = strapi.services.giftcard.discount(
    price,
    giftCard,
    giftCardPurchases,
    isGiftCardValid
  )
  if (!isGiftCardValid) {
    giftCardDiscount = 0
    giftCard = null
  }

  const isCouponValid = strapi.services.coupon.valid(coupon, existingCoupons)
  let couponDiscount = strapi.services.coupon.discount({
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
 * Coupons can only be used a certain number of times per user
 */
async function existingCoupons(user, code) {
  if (!user) {
    // For now we are trusting that users will not abuse coupons
    return []
  }
  if (typeof code !== 'string') {
    return []
  }
  const purchases = await strapi
    .query('purchase')
    .find({ contact: toId(user.contact), 'coupon.code': code })
  return purchases.map((purchase) => purchase.coupon)
}

/**
 * Price summary including discount, subtotal, etc.
 */
async function summary({
  user,
  price,
  outOfStockTotal,
  discountCode,
  context,
}) {
  const availableGiftCard = await strapi.services.giftcard.availableGiftCard(discountCode)
  const { discountPrice, giftCardDiscount, couponDiscount, giftCard, coupon } =
    await discount({
      price,
      outOfStockTotal,

      coupon: await strapi.services.coupon.availableCoupon(
        discountCode,
        context
      ),
      existingCoupons: await existingCoupons(user, discountCode),

      giftCard: availableGiftCard,
      giftCardPurchases: await strapi.services.giftcard.getPurchases(availableGiftCard),
      giftCardPaymentIntent: await strapi.services.giftcard.getPaymentIntent(availableGiftCard),
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
