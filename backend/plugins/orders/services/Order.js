"use strict";

module.exports = {
  calculatePrice(cart) {
    // returns cart price in smallest unit of currency
    const rentalPrice = {
      short: "shortRentalPrice",
      long: "longRentalPrice",
    };

    const itemPrice = (item) => {
      const itemPrice = item.product[rentalPrice[item.rentalLength]];
      // stripe expects an integer price in smallest unit of currency
      return item.quantity * itemPrice * 100;
    };

    let cartPrice = cartItems.reduce(
      (price, item) => price + itemPrice(item),
      0
    );
    if (process.env.NODE_ENV === "development" && cartPrice === 0) {
      cartPrice = 2000;
    }

    return cartPrice;
  },
};
