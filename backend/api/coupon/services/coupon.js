'use strict'

const { sanitizeEntity } = require('strapi-utils')

async function discount({ price, code, situation }) {
  const coupons = await strapi.query('coupon').find({ situation })
  const coupon = coupons.find((c) => c.code === code)
  if (coupon) {
    let newPrice
    switch (coupon.type) {
      case 'percent_off':
        newPrice = price - (price * coupon.amount) / 100
        break
      case 'amount_off':
        newPrice = price - coupon.amount
        break
      default:
        return {
          valid: false,
        }
    }

    return {
      valid: true,
      coupon: sanitizeEntity(coupon, { model: strapi.query('coupon').model }),
      price: newPrice,
    }
  } else {
    return { valid: false }
  }
}

module.exports = { discount }
