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
const cartPrice = (cart) =>
  cart.reduce((total, item) => total + price(item), 0)
const cartAmount = (cart) =>
  cart.reduce((total, item) => total + amount(item), 0)

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
 * @param {object} obj.insurance - Object mapping order ids to if insurance is enabled
 * @param {Cart} obj.cart
 * @param {User} obj.user
 * @param {string} obj.couponCode
 */
async function totalPrice({ insurance, cart, user, couponCode }) {
  const insurancePrice =
    Object.entries(insurance).filter(
      ([k, v]) =>
        v && (cart.find((item) => item.id == k) || { valid: true }).valid // add insurance only if cart item is valid
    ).length * INSURANCE_PRICE

  const shippingPrice = cart.reduce((acc, order) => {
    if (order.shippingClass) {
      return acc + shippingPrices[order.shippingClass]
    }
    return acc
  }, 0)
  const coupon = await strapi.services.price.availableCoupon(
    'checkout',
    couponCode
  )

  const subtotal = cartPrice(cart)
  const preDiscountPrice = subtotal + insurancePrice + shippingPrice
  const discountPrice =
    (await getDiscountPrice(preDiscountPrice, user)) +
    strapi.services.price.discount(coupon, preDiscountPrice)
  const total = Math.max(0, preDiscountPrice - discountPrice)

  return {
    subtotal,
    shipping: shippingPrice,
    insurance: insurancePrice,
    discount: discountPrice,
    coupon,
    total,
  }
}

/**
 * Converts {@link totalPrice} to amount
 */
function totalAmount(props) {
  const price = totalPrice(props)

  const amount = {}
  for (const key in price) {
    amount[key] = strapi.services.price.toAmount(price[key])
  }

  return amount
}

async function existingCoupons(user, code) {
  return (
    await strapi.query('order', 'orders').find({ user, 'coupon.code': code })
  ).map((order) => order.coupon)
}

module.exports = {
  totalAmount,
  totalPrice,
  price,
  amount,
  cartPrice,
  cartAmount,
  existingCoupons,
}
