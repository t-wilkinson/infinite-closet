"use strict";

const stripe = require("stripe")(
  "sk_test_51Ikb9lDnNgAk4A84a08Vrtj9h0K7Zg6C3HLSEhbZXRkC2E3wX2y9JDo67TOZI8spmVj4nvaHSamVwiKUokS9Kg5S00whW8RV3K"
);

const rental_price = {
  short: "short_rental_price",
  long: "long_rental_price",
};

const calculateCartPrice = (cart) => {
  return cart.reduce((price, item) => {
    const key = rental_price[item.rental_length];
    return price + item.quantity * item.product[key];
  }, 0);
};

module.exports = {
  createPaymentIntent: async (ctx) => {
    const user = ctx.state.user;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateCartPrice(user.cart),
      currency: "gbp",
      customer: user.customer,
      payment_method_types: ["card"],
      capture_method: "manual",
    });

    ctx.send({
      clientSecret: paymentIntent.client_secret,
    });
  },
};
