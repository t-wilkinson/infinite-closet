'use strict'

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

function price(order) {
  const shippingClass = strapi.services.shipment.shippingClass(
    order.created_at,
    order.startDate
  )
  const shippingPrice = shippingPrices[shippingClass]

  const productPrice = order.product[rentalPrice[order.rentalLength]] // TODO: should move this to product.services
  const insurancePrice = order.insurance ? INSURANCE_PRICE : 0

  return productPrice + insurancePrice + shippingPrice
}

const amount = (order) => strapi.services.price.toAmount(price(order))
const cartPrice = (cart) =>
  cart.reduce((total, item) => total + price(item), 0)
const cartAmount = (cart) =>
  cart.reduce((total, item) => total + amount(item), 0)

function totalAmount(props) {
  const price = totalPrice(props)

  const amount = {}
  for (const key in price) {
    amount[key] = strapi.services.price.toAmount(price[key])
  }

  return amount
}

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
 */
async function totalPrice({ insurance, cart, user }) {
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

  const subtotal = cartPrice(cart)
  const preDiscountTotal = subtotal + insurancePrice + shippingPrice
  const discountPrice = await getDiscountPrice(preDiscountTotal, user)
  const total = Math.max(0, preDiscountTotal - discountPrice)

  return {
    subtotal,
    shipping: shippingPrice,
    insurance: insurancePrice,
    discount: discountPrice,
    total,
  }
}

async function existingCoupons(user, code) {
  return (
    await strapi.query('order', 'orders').find({ user, 'coupon.code': code })
  ).map((order) => order.coupon)
}

async function checkoutTotal({ cart, insurance, user, couponCode }) {
  const price = await totalPrice({
    cart,
    insurance: insurance,
    user,
  })

  const summary = await strapi.services.price.summary({
    price: price.total,
    context: 'checkout',
    code: couponCode,
    existingCoupons: await existingCoupons(user.id, couponCode),
  })

  return {
    total: strapi.services.price.toAmount(summary.total),
    coupon: summary.coupon,
  }
}

module.exports = {
  totalAmount,
  totalPrice,
  price,
  amount,
  cartPrice,
  cartAmount,
  existingCoupons,
  checkoutTotal,
}
