'use strict'

const INSURANCE_PRICE = 5
const OG_USER_DISCOUNT_FLAT = 5

const shippingPrices = {
  one: 9.95,
  two: 0,
}

/**
 * Calculate price of order
 * @param {object} order
 * @returns number
 */
function orderPrice(order) {
  const shippingClass =
    strapi.services.shipment.shippingClass(
      order.shippingDate,
      order.startDate
    ) || shippingPrices.two

  const shippingPrice = shippingPrices[shippingClass]

  const productPrice = strapi.services.product.price(
    order.product,
    order.rentalLength
  )
  const insurancePrice = order.insurance ? INSURANCE_PRICE : 0

  return { productPrice, insurancePrice, shippingPrice }
}

function orderTotal(order) {
  return Object.values(orderPrice(order)).reduce(
    (total, price) => total + price,
    0
  )
}

function cartPrice(cart) {
  return {
    insurancePrice: cart.reduce(
      (total, item) => total + item.insurancePrice,
      0
    ),
    productPrice: cart.reduce((total, item) => total + item.productPrice, 0),
    shippingPrice: cart.reduce((total, item) => total + item.shippingPrice, 0),
  }
}

async function userDiscount(user) {
  const isOgUser = await strapi.query('user', 'users-permissions').findOne(
    {
      user: user.id,
      created_at_lt: strapi.services.timing.day('2021-07-20').toJSON(),
    },
    []
  )

  const hasOrderedBefore = await strapi.query('order', 'orders').findOne(
    {
      user: user.id,
      status_in: ['planning', 'shipping', 'cleaning', 'completed'],
      shippingDate_gt: strapi.services.timing.day('2021-07-30').toJSON(),
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
 * Calculates total price including discounts, promo codes, etc.
 * @param {object} obj
 * @param {Cart} obj.cart
 * @param {User} obj.user
 * @param {string} obj.couponCode
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
