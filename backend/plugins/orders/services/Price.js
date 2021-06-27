"use strict";

/********************  IMPORTANT ********************
 *
 * PRICE: decimal units
 * AMOUNT: smallest unit of currency
 *
 ********************  IMPORTANT ********************/

const SMALLEST_CURRENCY_UNIT = 100;
const INSURANCE_PRICE = 5;

const rentalPrice = {
  short: "shortRentalPrice",
  long: "longRentalPrice",
};

// const shippingPrices = {
//   "next-day": 9.95,
//   "one-day": 0,
//   "two-day": 0,
// };

const toAmount = (price) => price * SMALLEST_CURRENCY_UNIT;
const toPrice = (amount) => amount / SMALLEST_CURRENCY_UNIT;

function totalAmount(props) {
  const price = totalPrice(props);

  const amount = {};
  for (const key in price) {
    amount[key] = price[key] * SMALLEST_CURRENCY_UNIT;
  }

  return amount;
}

function totalPrice({ insurance, cart }) {
  const insurancePrice =
    Object.entries(insurance).filter(
      ([k, v]) =>
        v && (cart.find((item) => item.id == k) || { valid: true }).valid // add insurance only if cart item is valid
    ).length * INSURANCE_PRICE;
  const subtotal = cartPrice(cart);

  const total = subtotal + insurancePrice;

  return {
    subtotal,
    insurance: insurancePrice,
    total,
  };
}

function price(order) {
  // const date = dayjs(order.date);
  // const today = dayjs();
  // const dateBefore = (duration) =>
  //   date.isBefore(today.add(dayjs.duration(duration)), "hour");
  // const shippingType = dateBefore({ days: 1, hours: 12 })
  //   ? "next-day"
  //   : dateBefore({ days: 2, hours: 12 })
  //   ? "one-day"
  //   : "next-day";

  // const shippingPrice = shippingPrices[shippingType];
  const shippingPrice = 0;
  const productPrice = order.product[rentalPrice[order.rentalLength]];
  const insurancePrice = order.insurance ? INSURANCE_PRICE : 0;

  return productPrice + insurancePrice + shippingPrice;
}

const amount = (order) => toAmount(price(order));
const cartPrice = (cart) =>
  cart.reduce((total, item) => total + price(item), 0);
const cartAmount = (cart) =>
  cart.reduce((total, item) => total + amount(item), 0);

module.exports = {
  totalAmount,
  totalPrice,
  price,
  amount,
  cartPrice,
  cartAmount,
  toPrice,
  toAmount,
};
