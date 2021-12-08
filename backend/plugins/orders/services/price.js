'use strict'
const { day, toId } = require('../../../utils')

const INSURANCE_PRICE = 5
const OG_USER_DISCOUNT_FLAT = 5

const shippingPrices = {
  one: 9.95,
  two: 0,
}

// TODO: should this fail if any of the prices are undefined/null?
/**
 * Calculate sub-prices of order
 */
function orderPrice(order) {
  const shippingClass =
    strapi.services.timing.shippingClass(order.shippingDate, order.startDate) ||
    'two'

  const shippingPrice = shippingPrices[shippingClass] || 0
  const productPrice =
    strapi.services.product.price(order.product, order.rentalLength) || 0
  const insurancePrice = order.insurance ? INSURANCE_PRICE : 0

  return { productPrice, insurancePrice, shippingPrice }
}

/**
 * Sum all the sub-prices of an order
 */
function orderTotal(order) {
  return Object.values(orderPrice(order)).reduce(
    (total, price) => total + price,
    0
  )
}

function cartPrice(cart) {
  const sum = (values, key) =>
    values.reduce((total, value) => total + value[key], 0)
  return {
    insurancePrice: sum(cart, 'insurancePrice'),
    productPrice: sum(cart, 'productPrice'),
    shippingPrice: sum(cart, 'shippingPrice'),
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
      status_in: ['planning', 'shipping', 'cleaning', 'completed'],
      shippingDate_gt: day('2021-07-30').toJSON(), // When the discount is first applied
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

async function applyDiscounts({ user, preDiscountPrice, couponCode }) {
  const { coupon, discount } = await strapi.services.price.summary({
    price: preDiscountPrice,
    existingCoupons: await existingCoupons(user, couponCode),
    code: couponCode,
    context: 'checkout',
  })

  const discountPrice =
    discount + (await getDiscountPrice(preDiscountPrice, user))
  return { coupon, discountPrice }
}

/**
 * Calculates purchase summary of cart including discounts, promo codes, etc.
 * Uses `user` and `couponCode` to apply potential discounts.
 * @param {object} obj
 * @param {Cart} obj.cart
 * @param {User|string} obj.user
 * @param {string=} obj.couponCode
 */
async function summary({ cart, user, couponCode }) {
  user = user?.id || user
  const { productPrice, insurancePrice, shippingPrice } = cartPrice(cart)

  const preDiscountPrice = productPrice + insurancePrice + shippingPrice
  const { coupon, discountPrice } = await applyDiscounts({
    user,
    preDiscountPrice,
    couponCode,
  })

  if (discountPrice > preDiscountPrice && cart.length > 0) {
    throw new Error('Discount cannot be larger than pre-discount price.')
  }

  const total = preDiscountPrice - discountPrice
  return {
    preDiscount: preDiscountPrice,
    subtotal: productPrice,
    shipping: shippingPrice,
    insurance: insurancePrice,
    discount: cart.length > 0 ? discountPrice : 0,
    coupon: cart.length > 0 ? coupon : undefined,
    total,
    amount: strapi.services.price.toAmount(total),
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

  return (
    await strapi
      .query('order', 'orders')
      .find({ user: toId(user), 'coupon.code': code })
  ).map((order) => order.coupon)
}

module.exports = {
  summary,
  orderPrice,
  orderTotal,
  existingCoupons,
}
