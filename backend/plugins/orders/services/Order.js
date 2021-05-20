"use strict";

const rentalPrice = {
  short: "shortRentalPrice",
  long: "longRentalPrice",
};

const denomination = 100;

module.exports = {
  calculateCartPrice(cart) {
    calculatePrice = strapi.plugins["orders"].serivces.calculatePrice;
    const cartAmount = cart.reduce(
      (price, item) => price + calculateAmount(item),
      0
    );
    return cartAmount / denomination;
  },

  calculateAmount(order) {
    // returns cart price in smallest unit of currency
    const orderPrice = order.product[rentalPrice[order.rentalLength]];
    // stripe expects an integer price in smallest unit of currency
    let amount = order.quantity * orderPrice * denomination;
    if (process.env.NODE_ENV === "development" && amount === 0) {
      amount = 2000;
    }

    return amount;
  },
};
