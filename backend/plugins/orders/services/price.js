'use strict'

/********************  IMPORTANT ********************
 *
 * PRICE: decimal units ($10.50)
 * AMOUNT: smallest unit of currency (1050¢)
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

const amount = (order) => toAmount(price(order))
const cartPrice = (cart) =>
  cart.reduce((total, item) => total + price(item), 0)
const cartAmount = (cart) =>
  cart.reduce((total, item) => total + amount(item), 0)

async function existingCoupons(user, code) {
  return (
    await strapi.query('order', 'orders').find({ user, 'coupon.code': code })
  ).map((order) => order.coupon)
}

function discountedPrice(coupon, price) {
  switch (coupon.type) {
    case 'percent_off':
      return price * (coupon.amount / 100)
    case 'amount_off':
      return coupon.amount
    default:
      return 0
  }
}

// TODO: should we throw an error instead?
// TODO: should this just calculate discount (not the price)? Should merge this with existing discount code
/**
 * Calculates the discount price given coupon
 * @param {Object} obj
 * @param {number} obj.price - The calculated price
 * @param {string} obj.code - Supplied coupon
 * @param {Coupon[]} obj.existingCoupons - List of existing coupons with same code that are related to current discount transaction. Ex. the coupons attached to orders of current user.
 *
 * @returns {Object} Containing the new price, discounted price, and a reference to the coupon used
 */
function discount({ price, coupon, existingCoupons }) {
  if (!coupon) {
    return { valid: false, reason: 'not-found' }
  }

  const existingCouponCount = existingCoupons.reduce(
    (n, x) => n + (x.code === coupon.code),
    0
  )
  const couponMaxedOut = coupon.maxUses <= existingCouponCount
  if (couponMaxedOut) {
    return { valid: false, reason: 'maxed-out' }
  }

  const discount = discountedPrice(coupon, price)

  return {
    valid: true,
    discount,
    price: price - discount,
  }
}

module.exports = {
  discount,
  totalAmount,
  totalPrice,
  price,
  amount,
  cartPrice,
  cartAmount,
  toPrice,
  toAmount,
  existingCoupons,
}
