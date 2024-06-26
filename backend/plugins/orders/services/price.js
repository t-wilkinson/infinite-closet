'use strict'
const { day, toId } = require('../../../utils')

const INSURANCE_PRICE = 5
const OG_USER_DISCOUNT_FLAT = 5

const shippingPrices = {
  one: 9.95,
  two: 0,
}

/**
 * Calculate sub-prices of order
 */
function orderPrice(order) {
  const shippingClass =
    strapi.plugins['orders'].services.order.shippingClass(order) || 'two'
  const shippingPrice = shippingPrices[shippingClass] || 0
  const productPrice =
    strapi.services.product.price(order.product, order.rentalLength) || 0
  const insurancePrice = order.insurance ? INSURANCE_PRICE : 0

  return { productPrice, insurancePrice, shippingPrice }
}

function cartItemPrice(cartItem) {
  return (
    cartItem.productPrice + cartItem.insurancePrice + cartItem.shippingPrice
  )
}

function cartPrice(cart) {
  const sum = (values, key) =>
    values.reduce((total, value) => {
      return total + value[key]
    }, 0)

  const outOfStockTotal = cart.reduce((total, cartItem) => {
    const { order } = cartItem
    const isPreorder =
      strapi.services.size.quantity(order.product.sizes, order.size) === 0
    if (isPreorder) {
      return total + cartItemPrice(cartItem)
    } else {
      return total
    }
  }, 0)

  return {
    insurancePrice: sum(cart, 'insurancePrice'),
    productPrice: sum(cart, 'productPrice'),
    shippingPrice: sum(cart, 'shippingPrice'),
    outOfStockTotal,
  }
}

async function userDiscount(user) {
  // Users that signed up before prelaunch (2021-07-20)
  const isOgUser = await strapi.query('user', 'users-permissions').findOne(
    {
      id: toId(user),
      created_at_lt: day('2021-07-20').toJSON(),
    },
    []
  )

  const hasOrderedBefore = await strapi.query('order', 'orders').findOne(
    {
      user: toId(user),
      status_in: strapi.plugins['orders'].services.order.inConfirmed,
    },
    []
  )

  const ogUserDiscountFlat =
    isOgUser && !hasOrderedBefore ? OG_USER_DISCOUNT_FLAT : 0

  return {
    price: ogUserDiscountFlat,
    percent: 0,
  }
}

async function getDiscountPrice(price, user) {
  if (user) {
    const discount = await userDiscount(user)
    return price * (discount.percent / 100) + discount.price
  } else {
    return 0
  }
}

async function applyDiscounts({
  user,
  outOfStockTotal,
  preDiscountPrice,
  discountCode,
}) {
  const { coupon, giftCard, discount, giftCardDiscount, couponDiscount } =
    await strapi.services.price.summary({
      user,
      price: preDiscountPrice,
      outOfStockTotal,
      discountCode,
      context: 'checkout',
    })

  const discountPrice =
    discount + (await getDiscountPrice(preDiscountPrice, user))
  return { coupon, giftCard, discountPrice, giftCardDiscount, couponDiscount }
}

/**
 * Calculates purchase summary of cart including discounts, promo codes, etc.
 * Uses `user` and `discountCode` to apply potential discounts.
 * @param {object} obj
 * @param {Cart} obj.cart
 * @param {User|string} obj.user
 * @param {string=} obj.discountCode
 */
async function summary({ cart, user, discountCode }) {
  user = toId(user)
  const { outOfStockTotal, productPrice, insurancePrice, shippingPrice } =
    cartPrice(cart)

  const preDiscountPrice = productPrice + insurancePrice + shippingPrice
  let { coupon, giftCard, discountPrice, couponDiscount, giftCardDiscount } =
    await applyDiscounts({
      user,
      outOfStockTotal,
      preDiscountPrice,
      discountCode,
    })

  if (cart.length === 0) {
    discountPrice = 0
    coupon = undefined
    giftCard = undefined
  }

  if (discountPrice > preDiscountPrice) {
    throw new Error('Discount cannot be larger than pre-discount price.')
  }

  const total = preDiscountPrice - discountPrice
  return {
    preDiscount: preDiscountPrice,
    couponDiscount,
    giftCardDiscount,
    subtotal: productPrice,
    shipping: shippingPrice,
    insurance: insurancePrice,
    discount: discountPrice,
    coupon,
    giftCard,
    total,
    amount: strapi.services.price.toAmount(total),
  }
}

module.exports = {
  summary,
  orderPrice,
}
