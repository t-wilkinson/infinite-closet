'use strict'

/********************  IMPORTANT ********************
 *
 * PRICE: decimal units
 * AMOUNT: smallest unit of currency
 *
 ********************  IMPORTANT ********************/

const SMALLEST_CURRENCY_UNIT = 100
const INSURANCE_PRICE = 5

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

function totalPrice({ insurance, cart }) {
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
  const total = subtotal + insurancePrice + shippingPrice

  return {
    subtotal,
    shipping: shippingPrice,
    insurance: insurancePrice,
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
