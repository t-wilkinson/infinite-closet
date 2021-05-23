"use strict";

const rentalPrice = {
  short: "shortRentalPrice",
  long: "longRentalPrice",
};

const denomination = 100;

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

function amount(order) {
  return price(order) * denomination;
}

function cartPrice(cart) {
  const cartPrice = cart.reduce((price, item) => price + amount(item), 0);
  return cartPrice;
}

function availableKey(order) {
  return `${order.size}_${order.product.id.toString()}`;
}

module.exports = {
  price,
  amount,
  cartPrice,
  availableKey,

  async numAvailable() {
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
      const { product } = order;
      const productSize = product.sizes.find(
        ({ size }) => size === order.size
      ) || {
        quantity: 0, // sane default
      };
      const key = availableKey(order);

      // initialize counter with total product quantity
      counter[key] = counter[key] || productSize.quantity;

      // remove quantity of any order related to product
      if (["recieving", "planning"].includes(order.status)) {
        counter[key] -= order.quantity;
      }

      return counter;
    }, {});

    // console.log(numAvailable);
    return numAvailable;
  },
};
