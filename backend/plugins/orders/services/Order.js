"use strict";

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const isBetween = require("dayjs/plugin/isBetween");
const duration = require("dayjs/plugin/duration");

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

// TODO: this is copied from frontend
const rentalLengths = {
  short: 4,
  long: 8,
};

const DAYS_TO_SHIP = 2;
const DAYS_TO_RECIEVE = 2;
const DAYS_TO_CLEAN = 2;

function toRange({ date, length }) {
  date = dayjs(date);
  const rentalLength = rentalLengths[length];
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

const SMALLEST_CURRENCY_UNIT = 100;

const rentalPrice = {
  short: "shortRentalPrice",
  long: "longRentalPrice",
};

const amount = (order) => price(order) * SMALLEST_CURRENCY_UNIT;
const cartPrice = (cart) =>
  cart.reduce((price, item) => price + amount(item), 0);

function price(order) {
  // returns cart price in smallest unit of currency
  const orderPrice = order.product[rentalPrice[order.rentalLength]];
  // stripe expects an integer price in smallest unit of currency
  let price = order.quantity * orderPrice;
  if (process.env.NODE_ENV === "development" && price === 0) {
    price = 20;
  }
  return price;
}

module.exports = {
  price,
  amount,
  cartPrice,
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
      // then reduce available product quantity by order quantity
      const reqRange = reqRanges[key];
      const orderRange = toRange(order);
      const overlaps =
        reqRange &&
        rangesOverlap(reqRange, orderRange) &&
        inProgress(order.status);
      if (overlaps) {
        counter[key] -= order.quantity;
      }

      return counter;
    }, {});

    return numAvailable;
  },
};
