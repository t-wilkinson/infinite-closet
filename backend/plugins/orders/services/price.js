'use strict'

const INSURANCE_PRICE = 5
const WAITLIST_DISCOUNT_PRICE = 5
const NEW_USER_DISCOUNT_PERCENT = 10

const shippingPrices = {
  one: 9.95,
  two: 0,
}

/**
 * Calculate price of order
 * @param {object} order
 * @returns number
 */
function price(order) {
  const shippingClass = strapi.services.shipment.shippingClass(
    order.created_at,
    order.startDate
  )
  const shippingPrice = shippingPrices[shippingClass]

  const productPrice = strapi.services.product.price(
    order.product,
    order.rentalLength
  )
  const insurancePrice = order.insurance ? INSURANCE_PRICE : 0

  return productPrice + insurancePrice + shippingPrice
}

const amount = (order) => strapi.services.price.toAmount(price(order))
const ordersPrice = (orders) =>
  orders.reduce((total, order) => total + price(order), 0)
const ordersAmount = (orders) =>
  orders.reduce((total, order) => total + amount(order), 0)
const cartPrice = (cart) => cart.reduce((total, item) => total + item.price, 0)
const cartAmount = (cart) =>
  cart.reduce(
    (total, item) => total + strapi.services.price.toAmount(item.price),
    0
  )

async function userDiscount(user) {
  const hasOrderedBefore = await strapi.query('order', 'orders').findOne(
    {
      user: user.id,
      status_in: ['planning', 'shipping', 'cleaning', 'completed'],
      shippingDate_gt: strapi.services.timing.day('2021-07-30').toJSON(),
    },
    []
  )

  const newUserDiscountPercent = hasOrderedBefore
    ? 0
    : NEW_USER_DISCOUNT_PERCENT

  const isOnWaitingList = await strapi.query('contact').findOne({
    context_in: ['waitlist', 'newsletter'],
    contact: user.email,
  })
  const waitlistDiscountPrice =
    !hasOrderedBefore && isOnWaitingList ? WAITLIST_DISCOUNT_PRICE : 0

  return {
    price: waitlistDiscountPrice,
    percent: newUserDiscountPercent,
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
  const orders = strapi.plugins['orders'].services.cart.orders(cart)
  const insurancePrice =
    orders.filter((order) => order.insurance).length * INSURANCE_PRICE
  const shippingPrice = cart.reduce(
    (acc, item) => acc + shippingPrices[item.shippingClass],
    0
  )

  const subtotal = cartPrice(cart)
  const preDiscountPrice = subtotal + insurancePrice + shippingPrice

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
    subtotal,
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
  price,
  amount,
  existingCoupons,
  cartPrice,
  cartAmount,
  ordersPrice,
  ordersAmount,
}
