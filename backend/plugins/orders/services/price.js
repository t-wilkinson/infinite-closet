'use strict'
const {day} = require('../../../utils')

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
    strapi.services.shipment.shippingClass(
      order.shippingDate,
      order.startDate
    ) || 'two'

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
      id: user.id,
      created_at_lt: day('2021-07-20').toJSON(),
    },
    []
  )

  const hasOrderedBefore = await strapi.query('order', 'orders').findOne(
    {
      user: user.id,
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

/**
 * Calculates purchase summary of cart including discounts, promo codes, etc.
 * Uses `user` and `couponCode` to apply potential discounts.
 * @param {object} obj
 * @param {Cart} obj.cart
 * @param {User=} obj.user
 * @param {string=} obj.couponCode
 */
async function summary({ cart, user, couponCode }) {
  const { productPrice, insurancePrice, shippingPrice } = cartPrice(cart)
  const preDiscountPrice = productPrice + insurancePrice + shippingPrice

  const coupon = await strapi.services.price.availableCoupon(
    'checkout',
    couponCode
  )
  const couponDiscount = coupon
    ? strapi.services.price.discount(coupon, preDiscountPrice)
    : 0
  const discountPrice =
    (await getDiscountPrice(preDiscountPrice, user)) + couponDiscount

  const total = Math.max(0, preDiscountPrice - discountPrice)

  return {
    preDiscount: preDiscountPrice,
    subtotal: productPrice,
    shipping: shippingPrice,
    insurance: insurancePrice,
    discount: discountPrice,
    coupon,
    total,
    amount: strapi.services.price.toAmount(total),
  }
}

// TODO: should this return [] when not passed user?
/**
 * Coupons can only be used a certain number of times per user
 */
async function existingCoupons(user, code) {
  return (
    await strapi.query('order', 'orders').find({ user, 'coupon.code': code })
  ).map((order) => order.coupon)
}

module.exports = {
  summary,
  orderPrice,
  orderTotal,
  existingCoupons,
}
