"use strict";

const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const isBetween = require("dayjs/plugin/isBetween");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

// TODO: this is copied from frontend
const rentalLengths = {
  short: 4,
  long: 8,
};

const DAYS_TO_SHIP = 1;
const DAYS_TO_RECIEVE = 2;
const DAYS_TO_CLEAN = 2;

function toRange({ date, rentalLength }) {
  date = dayjs(date);
  rentalLength = rentalLengths[rentalLength];
  // TODO: calculate how many days this item will take to ship based on status etc.
  return {
    start: date.subtract(DAYS_TO_SHIP, "day"),
    returning: date.add(dayjs.duration({ days: rentalLength })),
    cleaning: date.add(
      dayjs.duration({ days: rentalLength + DAYS_TO_RECIEVE })
    ),
    end: date.add(
      dayjs.duration({ days: rentalLength + DAYS_TO_RECIEVE + DAYS_TO_CLEAN })
    ),
  };
}

const inProgress = (status) =>
  ["planning", "shipping", "cleaning"].includes(status);
const rangesOverlap = (range1, range2) =>
  !(range1.end.isBefore(range2.start) || range1.start.isAfter(range2.end));

function toKey(order) {
  let productID;
  if (order.product.id !== undefined) {
    productID = order.product.id;
  } else {
    productID = order.product;
  }
  return `${order.size}_${productID}`;
}

/********************  IMPORTANT ********************
 *
 * PRICE: decimal units
 * AMOUNT: smallest unit of currency
 */
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

const amount = (order) => price(order) * SMALLEST_CURRENCY_UNIT;
const cartPrice = (cart) =>
  cart.reduce((price, item) => price + price(item), 0);
const cartAmount = (cart) =>
  cart.reduce((price, item) => price + amount(item), 0);

module.exports = {
  price,
  amount,
  cartPrice,
  cartAmount,
  toKey,

  dateValid(order) {
    const date = dayjs(order.date).tz("GMT");
    const today = dayjs().tz("GMT");
    const isNotSunday = date.day() !== 0;
    const enoughShippingTime = date.isAfter(
      today
        .add(2, "day") // allow at least 2 days for shipping
        .add(12, "hour"), // shipping service won't deliver items requested after 2 days
      "hour"
    );

    return isNotSunday && enoughShippingTime;
  },

  async numAvailable(cart = []) {
    const reqRanges = cart.reduce((acc, order) => {
      acc[toKey(order)] = toRange(order);
      return acc;
    }, {});

    // attach `sizes` component to `order.product.sizes`
    let orders = await strapi.query("order", "orders").find({}, []);
    orders = await Promise.allSettled(
      orders.map(async (order) => {
        order.product = await strapi
          .query("product")
          .findOne({ id: order.product });
        return order;
      })
    );

    // calculate available product quantities by removing existing order quantities
    const numAvailable = orders.reduce((counter, settled) => {
      if (settled.status === "rejected") {
        return counter;
      }

      const order = settled.value;
      const key = toKey(order);
      const { product } = order;

      // get product size that matches order.size
      const defaultSize = { quantity: 0 };
      const productSize =
        product.sizes.find(({ size }) => size === order.size) || defaultSize;
      if (!(key in counter)) {
        counter[key] = productSize.quantity;
      }

      // if request date overlaps with order duration
      // then reduce available product quantity by 1
      const reqRange = reqRanges[key];
      const orderRange = toRange(order);
      const overlaps =
        reqRange &&
        rangesOverlap(reqRange, orderRange) &&
        inProgress(order.status);
      if (overlaps) {
        counter[key] -= 1;
      }

      return counter;
    }, {});

    return numAvailable;
  },
};
