'use strict'

/********************  IMPORTANT ********************
 *
 * PRICE: decimal units
 * AMOUNT: smallest unit of currency
 *
 ********************  IMPORTANT ********************/

const SMALLEST_CURRENCY_UNIT = 100
const INSURANCE_PRICE = 5
const WAITLIST_DISCOUNT_PRICE = 5
const NEW_USER_DISCOUNT_PERCENT = 10

const rentalPrice = {
  short: 'shortRentalPrice',
  long: 'longRentalPrice',
}

const shippingPrices = {
  one: 9.95,
  two: 0,
}

// Services like stripe expect no decimal points, and to be in units of smallest currency
const toAmount = (price) => Math.round(price * SMALLEST_CURRENCY_UNIT)
const toPrice = (amount) => amount / SMALLEST_CURRENCY_UNIT

function totalAmount(props) {
  const price = totalPrice(props)

  const amount = {}
  for (const key in price) {
    amount[key] = toAmount(price[key])
  }

  return amount
}

async function userDiscount(user) {
  const hasOrderedBefore = await strapi.query('order', 'orders').findOne(
    {
      user: user.id,
      status_in: ['planning', 'shipping', 'cleaning', 'completed'],
      shippingDate_gt: strapi.plugins['orders'].services.date
        .day('2021-07-30')
        .toJSON(),
    },
    []
  )

  const newUserDiscountPercent = hasOrderedBefore
    ? 0
    : NEW_USER_DISCOUNT_PERCENT

  const isOnWaitingList = await strapi.query('contact').findOne({
    context: 'waitlist',
    contact: user.email,
  })
  const waitlistDiscountPrice =
    !hasOrderedBefore && isOnWaitingList ? WAITLIST_DISCOUNT_PRICE : 0

  return {
    price: waitlistDiscountPrice,
    percent: newUserDiscountPercent,
  }
}

async function totalPrice({ insurance, cart, user }) {
  const insurancePrice =
    Object.entries(insurance).filter(
      ([k, v]) =>
        v && (cart.find((item) => item.id == k) || { valid: true }).valid // add insurance only if cart item is valid
    ).length * INSURANCE_PRICE
  const subtotal = cartPrice(cart)

  const shippingPrice = cart.reduce((acc, order) => {
    if (order.shippingClass) {
      return acc + shippingPrices[order.shippingClass]
    }
    return acc
  }, 0)

  const preDiscountTotal = subtotal + insurancePrice + shippingPrice
  const discount = await userDiscount(user)
  const discountPrice =
    preDiscountTotal * (discount.percent / 100) + discount.price
  const total = Math.max(0, preDiscountTotal - discountPrice)

  return {
    subtotal,
    shipping: shippingPrice,
    insurance: insurancePrice,
    discount: discountPrice,
    total,
  }
}

function price(order) {
  const shippingClass =
    strapi.plugins['orders'].services.date.shippingClass(order)
  const shippingPrice = shippingPrices[shippingClass]

  const productPrice = order.product[rentalPrice[order.rentalLength]]
  const insurancePrice = order.insurance ? INSURANCE_PRICE : 0

  return productPrice + insurancePrice + shippingPrice
}

const amount = (order) => toAmount(price(order))
const cartPrice = (cart) =>
  cart.reduce((total, item) => total + price(item), 0)
const cartAmount = (cart) =>
  cart.reduce((total, item) => total + amount(item), 0)

module.exports = {
  totalAmount,
  totalPrice,
  price,
  amount,
  cartPrice,
  cartAmount,
  toPrice,
  toAmount,
}
