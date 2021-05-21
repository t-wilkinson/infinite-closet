"use strict";

const rentalPrice = {
  short: "shortRentalPrice",
  long: "longRentalPrice",
};

const denomination = 100;

function calculatePrice(order) {
  // returns cart price in smallest unit of currency
  const orderPrice = order.product[rentalPrice[order.rentalLength]];
  // stripe expects an integer price in smallest unit of currency
  let price = order.quantity * orderPrice;
  if (process.env.NODE_ENV === "development" && price === 0) {
    price = 20;
  }
  return price;
}

function calculateAmount(order) {
  return calculatePrice(order) * denomination;
}

function calculateCartPrice(cart) {
  const cartPrice = cart.reduce(
    (price, item) => price + calculateAmount(item),
    0
  );
  return cartPrice;
}

module.exports = {
  calculatePrice,
  calculateAmount,
  calculateCartPrice,
};
